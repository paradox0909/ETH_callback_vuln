const Web3 = require('web3');
const fs = require('fs');
const http = require('http');

const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));

// 스마트 컨트랙트 ABI 및 주소 *중요*
const contractABI = [/* ABI를 여기에 입력하세요 */];
const contractAddress = '0x...';  // 스마트 컨트랙트 주소

const contract = new web3.eth.Contract(contractABI, contractAddress);

contract.events.FlagRequested()
    .on('data', (event) => {
        const requester = event.returnValues.requester;
        const flag = fs.readFileSync('flag.txt', 'utf8');

        // 플래그를 요청한 사용자에게 전송하는 로직 (예: 이메일, 블록체인 트랜잭션 등)
        console.log(`Flag requested by: ${requester}`);
        console.log(`Flag: ${flag}`);
    })
    .on('error', console.error);

const server = http.createServer((req, res) => {
    if (req.method === 'GET' && req.url === '/requestFlag') {
        const account = '0x...'; // 사용자의 Ethereum 주소 *중요*
        contract.methods.requestFlag().send({ from: account })
            .then((receipt) => {
                res.writeHead(200, {'Content-Type': 'text/plain'});
                res.end('Flag requested. Check logs for flag.');
            })
            .catch((error) => {
                res.writeHead(500, {'Content-Type': 'text/plain'});
                res.end('Error requesting flag.');
            });
    } else {
        res.writeHead(404, {'Content-Type': 'text/plain'});
        res.end('Not Found');
    }
});

server.listen(3000, () => {
    console.log('Server listening on port 3000');
});
