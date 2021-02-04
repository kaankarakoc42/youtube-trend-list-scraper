from subprocess import run,PIPE
from json import loads,dumps


class api:
  def __init__(self):
      ...

  def getDataLocally(self):
      _api=run(["node","main.js","--getDataLocally"],stdout=PIPE).stdout.decode("utf-8")
      if not "/*Error*/" in _api:
         return loads(_api)


  def getData(self):
      _api=run(["node","main.js","--getData"],stdout=PIPE).stdout.decode("utf-8")
      if not "/*Error*/" in _api:
         return loads(_api)


  def LocalDataDump(self,data="trends"):
      try:
       for i in self.getDataLocally().get(data):
           print(dumps(i,indent=4))
      except:
         return False

API = api()

class _youtube:
     def __init__(self): ...

     def getData(self):
        try:
         data = API.getDataLocally()
         if not data:
            data = API.getData()
            if not data:
                return False
         return data
        except:
            return False
     def updateData(self):
        try:
         data = API.getData()
         if not data:
           return False
         else:
            return True
        except:
            return False
     def showData(self):
          API.LocalDataDump()

youtube=_youtube()
