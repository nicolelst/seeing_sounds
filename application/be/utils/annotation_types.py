from enum import Enum

class AnnotationInterface(str, Enum):
  FLOATING = "floating"
  COLOUR = "colour"
  POINTER = "pointer"
  TRADITIONAL = "traditional"
