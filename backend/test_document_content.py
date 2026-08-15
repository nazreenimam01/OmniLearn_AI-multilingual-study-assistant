from document_content_service import get_document_text


document_name = "Module_4_2_Web.pdf"

text = get_document_text(document_name)

if text:
    print("Document retrieved successfully.")
    print("Text length:", len(text))
    print("\nFirst 1000 characters:\n")
    print(text[:1000])
else:
    print("Document not found.")