import time
import json
import random

log_file = "zeek_notice.log"

def make_fake_zeek_log():
    alerts = [
        {"note": "SSL::Invalid_Server_Cert", "msg": "Untrusted certificate detected", "proto": "tcp", "port": 443},
        {"note": "SSH::Password_Guessing", "msg": "Possible SSH brute force", "proto": "tcp", "port": 22},
        {"note": "DNS::External_Name_Discovery", "msg": "High volume of DNS queries", "proto": "udp", "port": 53},
        {"note": "HTTP::SQL_Injection_Attempt", "msg": "Suspicious URI payload", "proto": "tcp", "port": 80}
    ]
    
    chosen = random.choice(alerts)
    
    src_ip = "192.168.1." + str(random.randint(10, 250))
    dest_ip = str(random.randint(1, 200)) + "." + str(random.randint(1, 255)) + ".35.1"
    
    fake_log = {
        "ts": time.time(),
        "uid": "C" + str(random.randint(10000, 99999)),
        "id.orig_h": src_ip,
        "id.orig_p": random.randint(1024, 65535),
        "id.resp_h": dest_ip,
        "id.resp_p": chosen["port"],
        "proto": chosen["proto"],
        "note": chosen["note"],
        "msg": chosen["msg"]
    }
    
    f = open(log_file, "a")
    f.write(json.dumps(fake_log) + "\n")
    f.close()
    
    print("Generated alert: " + chosen["note"] + " -> Saved to " + log_file)

def start_simulator():
    print("Zeek Simulator")
    print("----------------")
    print("1. Send one test alert")
    print("2. Run continuous mode")
    
    choice = input("Choose (1 or 2): ")
    
    if choice == "2":
        print("Continuous mode started. Press Ctrl+C to stop.")
        try:
            while True:
                make_fake_zeek_log()
                # wait random time between 10 and 25 seconds
                wait_time = random.randint(10, 25)
                print("Waiting " + str(wait_time) + " seconds...")
                time.sleep(wait_time)
        except KeyboardInterrupt:
            print("Stopped.")
    else:
        make_fake_zeek_log()
        print("Done.")

if __name__ == "__main__":
    start_simulator()