import fitz  # PyMuPDF
import sys

if len(sys.argv) != 2:
    print("Usage: python model.py <pdf_file_path>")
    sys.exit(1)

pdf_path = sys.argv[1]

try:
    # Open the PDF document
    document = fitz.open(pdf_path)

    # Initialize a variable to store the text
    text = ""

    # Iterate over each page in the document
    for page_num in range(document.page_count):
        page = document.load_page(page_num)
        page_text = page.get_text("text")
        
        # Append the text from the current page to the variable
        text += page_text

    # Close the document
    document.close()

    # Print the extracted text
    print(text)

except Exception as e:
    print(f"Error extracting text: {str(e)}")
    sys.exit(1)