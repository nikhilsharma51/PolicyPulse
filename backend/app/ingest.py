from pypdf import PdfReader
import io

def extract_pages(file_bytes : bytes) -> list[dict]:
   reader = PdfReader(io.BytesIO(file_bytes))
   pages = []

   for i , page in enumerate(reader.pages):
      text = page.extract_text()

      if text and text.strip():
        pages.append({"page_number": i+1, "text":text})
   return pages