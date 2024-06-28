const Web3 = require('web3');
const fs = require('fs');
const http = require('http');
const VulnerableAuction = require('./build/contracts/VulnerableAuction.json');

// Web3 인스턴스 생성
const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));

// 스마트 컨트랙트 ABI 및 주소
const contractABI = VulnerableAuction.abi;
const contractAddress = VulnerableAuction.networks['5777'].address; // 예시로 네트워크 ID 사용

const contract = new web3.eth.Contract(contractABI, contractAddress);

// 이벤트 리스너 설정
contract.events.FlagRequested()
    .on('data', (event) => {
        const requester = event.returnValues.requester;
        const flag = fs.readFileSync('flag.txt', 'utf8');

        // 플래그를 요청한 사용자에게 전송하는 로직 (예: 이메일, 블록체인 트랜잭션 등)
        console.log(`Flag requested by: ${requester}`);
        console.log(`Flag: ${flag}`);
    })
    .on('error', console.error);

// HTTP 서버 생성 (플래그 요청을 위한 인터페이스)
const server = http.createServer((req, res) => {
    if (req.method === 'GET' && req.url === '/requestFlag') {
        // 플래그 요청 로직
        // (스마트 컨트랙트의 requestFlag 함수를 호출)
        const account = '0x5D168217161a1155A0644d5533963b5Ef5e09395'; // 사용자의 Ethereum 주소
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

// 서버 시작
server.listen(3000, () => {
    console.log('Server listening on port 3000');
});
