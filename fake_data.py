# this program prints random data,
# and is expected to be combined with websocketd
# to allow testing of the scope code
# $ websocketd --port 8080 fake_data
from sys import stdout
from time import sleep
import random
import json

# make some fake pulse data
dat = {'DCRC1':{'PA':{'pulse_data':[]}}}

while True:
  dat['DCRC1']['PA']['pulse_data'] = [random.randint(0,5000) for _ in xrange(256)]

  print(json.dumps(dat))
  stdout.flush()
  sleep(0.5)
