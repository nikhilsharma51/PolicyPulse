import asyncio
import json
from pathlib import Path

from datasets import Dataset
from langchain_google_genai import ChatGoogleGenerativeAI, GoogleGenerativeAIEmbeddings
from ragas import evaluate
from ragas.metrics import (
    faithfulness,
    answer_relevancy,
    context_precision,
    context_recall,
)

from app.generate import stream_answer  # or a non-streaming variant, see note below
from app.retrieve import hybrid_retrieve  # your BM25+dense+RRF+rerank function

TESTSET_PATH = Path(__file__).parent / "testset.json"


async def collect_run_data(testset: list[dict]) -> dict:
    questions, contexts, answers, ground_truths = [], [], [], []

    for item in testset:
        chunks = await hybrid_retrieve(item["question"], item["doc_id"])
        context_texts = [c["text"] for c in chunks]

        # Collect full answer text (see note on non-streaming below)
        answer_parts = []
        async for token in stream_answer(item["question"], item["doc_id"]):
            answer_parts.append(token)
        answer = "".join(answer_parts)

        questions.append(item["question"])
        contexts.append(context_texts)
        answers.append(answer)
        ground_truths.append(item["ground_truth"])

    return {
        "question": questions,
        "contexts": contexts,
        "answer": answers,
        "ground_truth": ground_truths,
    }


def main():
    testset = json.loads(TESTSET_PATH.read_text())
    data = asyncio.run(collect_run_data(testset))
    dataset = Dataset.from_dict(data)

    judge_llm = ChatGoogleGenerativeAI(model="gemini-1.5-flash")
    judge_embeddings = GoogleGenerativeAIEmbeddings(model="models/embedding-001")

    result = evaluate(
        dataset,
        metrics=[faithfulness, answer_relevancy, context_precision, context_recall],
        llm=judge_llm,
        embeddings=judge_embeddings,
    )

    df = result.to_pandas()
    print(df[["question", "faithfulness", "answer_relevancy", "context_precision", "context_recall"]])
    df.to_csv(Path(__file__).parent / f"results_{result}.csv", index=False)


if __name__ == "__main__":
    main()