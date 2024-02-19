const dns = require("dns");

const url = "google.com";
const ip = "216.58.196.110";
exports.getHostname = (req, res) => {
	dns.lookup(url, (err, address) => {
		if (err) {
			console.log("DNS lookup error", err);
		} else {
			res.send({
				message: `IP address ${address}`,
			});
		}
	});
};

exports.getReverseDNS = (req, res) => {
	try {
		dns.reverse(ip, (err, hostname) => {
			if (err) {
				console.log("Reverse DNS lookup error");
			} else {
				res.send(`DNS name is ${hostname}`);
			}
		});
	} catch (err) {
		res.send({
			error: err,
		});
	}
};

exports.getIPV4 = (req, res) => {
	try {
		dns.resolve4("www.google.com", (err, addresses) => {
			if (err) {
				console.log(err);
			} else {
				res.send(`IPV4 address is ${addresses}`);
			}
		});
	} catch (err) {}
};

exports.cacheDNS = () => {
    try{
        dns.setTTL(300);
        dns.lookup(url, (err, address) => {
            if (err) {
              console.error('DNS lookup error:', err);
            } else {
              res.send('IP address:', address);

            }
          });
    }
    catch(err){

    }
}
