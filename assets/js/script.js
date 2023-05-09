function enc() {
    let plaintext = document.getElementById("pt").value.toUpperCase().replace(/[^A-Z]/g, '');
    let key = document.getElementById("key").value;
    let cipher = document.getElementById("cipher").value;
    if ("1" == cipher) {
        multiplicative(plaintext, key);
    }
    if ("2" == cipher) {
        autokey(plaintext, key);
    }
    if ("3" == cipher) {
        rail_fence(plaintext, key);
    }
    if ("4" == cipher) {
        vigenere(plaintext, key);
    }
}
function dec() {
    let ciphertext_d = document.getElementById("ct-d").value.toUpperCase().replace(/[^A-Z]/g, '');
    let key_d = document.getElementById("key-d").value;
    let cipher_d = document.getElementById("cipher-d").value;
    if ("1-d" == cipher_d) {
        multiplicative_d(ciphertext_d, key_d);
    }
    if ("2-d" == cipher_d) {
        autokey_d(ciphertext_d, key_d);
    }
    if ("3-d" == cipher_d) {
        rail_fence_d(ciphertext_d, key_d);
    }
    if ("4-d" == cipher_d) {
        vigenere_d();
    }
}

function multiplicative(plaintext, key) {
    const k = parseInt(key);
    const m = 26;
    let ciphertext = '';

    for (let i = 0; i < plaintext.length; i++) {
        const charCode = plaintext.charCodeAt(i) - 65;
        const encryptedCharCode = (k * charCode) % m;
        const encryptedChar = String.fromCharCode(encryptedCharCode + 65);
        ciphertext += encryptedChar;
    }
    document.getElementById('ct').value = ciphertext;
}
function modInverse(a, m) {
    a = a % m;
    for (let x = 1; x < m; x++) {
        if ((a * x) % m === 1) {
            return x;
        }
    }
    return 1;
}
function multiplicative_d(ciphertext, key) {
    const k = parseInt(key);
    let plaintext = '';
    const inverse = modInverse(k, 26);

    for (let i = 0; i < ciphertext.length; i++) {
        const cipherNum = ciphertext.charCodeAt(i) - 65;
        const plainNum = (cipherNum * inverse) % 26;
        const plainChar = String.fromCharCode(plainNum + 65);
        plaintext += plainChar;
    }
    document.getElementById('pt-d').value = plaintext;
}
function autokey(plaintext, key) {
    let ciphertext = '';
    const m = 26;
    let k = key.toUpperCase();
    k = k + plaintext;
    k = k.slice(0, -1);
    for (let i = 0; i < plaintext.length; i++) {
        const charCode = plaintext.charCodeAt(i) - 65;
        const keyChar = i < k.length ? k.charCodeAt(i) - 65 : ciphertext.charCodeAt(i - k.length) - 65;
        const encryptedCharCode = (keyChar + charCode) % m;
        const encryptedChar = String.fromCharCode(encryptedCharCode + 65);
        ciphertext += encryptedChar;
    }
    document.getElementById('ct').value = ciphertext;
}

function autokey_d(ciphertext, key) {

}

function rail_fence(plaintext, key) {
    let ciphertext = '';
    const k = parseInt(key);
    const numRails = k;
    const railMatrix = new Array(numRails).fill().map(() => new Array(plaintext.length).fill('.'));
    let rail = 0;
    let dir = 1;

    for (let i = 0; i < plaintext.length; i++) {
        railMatrix[rail][i] = plaintext.charAt(i);
        rail += dir;
        if (rail === 0 || rail === numRails - 1) {
            dir = -dir;
        }
    }

    for (let i = 0; i < numRails; i++) {
        for (let j = 0; j < plaintext.length; j++) {
            if (railMatrix[i][j] !== '.') {
                ciphertext += railMatrix[i][j];
            }
        }
    }
    document.getElementById('ct').value = ciphertext;
}

function rail_fence_d(ciphertext, key) {
    var plaintext = "";

    var railLengths = new Array(key).fill(0);
    var currentRail = 0;
    var direction = 1;

    for (var i = 0; i < ciphertext.length; i++) {
        railLengths[currentRail]++;
        currentRail += direction;
        if (currentRail === key - 1 || currentRail === 0) {
            direction *= -1;
        }
    }

    var railOffsets = new Array(key).fill(0);
    var offset = 0;

    for (var i = 0; i < key; i++) {
        railOffsets[i] = offset;
        offset += railLengths[i];
    }

    for (var i = 0; i < ciphertext.length; i++) {
        var railIndex = getRailIndex(i, key);
        var railOffset = railOffsets[railIndex];
        plaintext += ciphertext.charAt(railOffset);
        railOffsets[railIndex]++;
    }

    document.getElementById("pt-d").value = plaintext;
}

function getRailIndex(position, key) {
    var currentRail = 0;
    var direction = 1;

    for (var i = 0; i < position; i++) {
        currentRail += direction;
        if (currentRail === key - 1 || currentRail === 0) {
            direction *= -1;
        }
    }

    return currentRail;
}