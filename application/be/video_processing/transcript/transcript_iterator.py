import json


class Transcript_Iterator():
    def __init__(self, filepath):
        self.filepath = filepath
        self.json = json.load(open(filepath, "r"))
        self.idx = 0

    def __iter__(self):
        self.idx = 0
        return self

    def __next__(self):
        if self.idx < len(self.json["segments"]):
            result = self.json["segments"][self.idx]
            self.idx += 1
            return result
        else:
            return None