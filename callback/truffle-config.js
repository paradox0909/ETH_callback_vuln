module.exports = {
    networks: {
      development: {
        host: "127.0.0.1",     // 로컬 네트워크의 IP 주소
        port: 8545,            // 가나슈 포트
        network_id: "*",       // 모든 네트워크 ID와 매치
      }
    },
    compilers: {
      solc: {
        version: "0.8.0"      // 사용할 Solidity 컴파일러 버전
      }
    }
  };
  