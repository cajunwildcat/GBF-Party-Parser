import requests
import json
import time

_session = requests.Session()
apiURL = "https://gbf.wiki/api.php?origin=*"
limit = 500
headers = { "User-Agent": "Mozilla/5.0 (X11; Linux x86_64; rv:42.0) Gecko/20100101 Firefox/42.0" }
def requestData(table, fields, offset):
    time.sleep(0.5)
    params = {
        "action": "cargoquery",
        "tables": table,
        "fields": fields,
        "format": "json",
        "limit": limit,
        "offset": offset
    }
    
    r = requests.Request("GET", url=apiURL, params=params, headers=headers)
    r = r.prepare()
    
    s = _session.send(request=r)
    if s.status_code != 200:
        print("Request did not succeed: ", s.status_code)
    else:
        o = s.json()
        o = o["cargoquery"]
        d = {}
        for c in o:
            c = c["title"]
            q = {}
            for prop in c:
                if prop == "id": continue
                q[prop] = c[prop]
            d[c["id"]] = q
        if len(o) == limit:
            d.update(requestData(table, fields, offset + limit))
        return d

f = open("characters.json", "w")
f.write(json.dumps(requestData("characters", "id,_pageName=name", 0)))
f.close()

f = open("summons.json", "w")
f.write(json.dumps(requestData("summons", "id,_pageName=name", 0)))
f.close()