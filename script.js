setTimeout(async() => console.log(
    await window.navigator.clipboard.writeText(product)), 3000)
document.getElementById("input").value = product;