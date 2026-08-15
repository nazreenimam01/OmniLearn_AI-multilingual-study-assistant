from simplification_service import simplify_text


text = """
Photosynthesis is a complex biochemical process through which
autotrophic organisms, primarily green plants, convert light energy
into chemical energy in the form of glucose. This process occurs
mainly within the chloroplasts and involves chlorophyll absorbing
light energy.
"""

result = simplify_text(text)

print("\nSIMPLIFIED TEXT:\n")
print(result)