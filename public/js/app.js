const isImage = (fileName) => {
    let allowedExtReg = /(\.jpg|\.jpeg|\.png)$/i;
    let result = allowedExtReg.exec(fileName);
    return result;
}
const main = () => {
    const canvas = document.getElementById("canvas");
    const btnSend = document.getElementById("btnSend");
    const fileInput = document.getElementById("imageInput");
    const loader = document.getElementById("loader");
    const ctx = canvas.getContext("2d");
    const displayImage = (base64Img) => {
        let img = new Image();
        img.src = base64Img;
        img.onload = (evt) => {
            let widthScale = canvas.width / img.width;
            let heightScale = canvas.height / img.height;
            var ratio = Math.min(widthScale, heightScale);
            var centerShift_x = (canvas.width - img.width * ratio) / 2;
            var centerShift_y = (canvas.height - img.height * ratio) / 2;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(
                img,
                0,
                0,
                img.width,
                img.height,
                centerShift_x,
                centerShift_y,
                img.width * ratio,
                img.height * ratio);
        }
    }

    fileInput.onchange = (evt) => {
        let files = evt.target.files;
        if (files && files.length > 0) {
            let selectedImage = files[0];
            let fileName = selectedImage.name;
            if (isImage(fileName)) {
                let fr = new FileReader();
                // load file as base64 string encoded
                fr.readAsDataURL(selectedImage);
                fr.onload = (evt) => {
                    const base64Image = evt.target.result; // fr.result
                    displayImage(base64Image);
                }
            }
        }
    }

    const sendImage = () => {
        var fullQualityImage = canvas.toDataURL('image/jpeg', 1.0);
        const formData = new FormData();
        formData.append("image", fullQualityImage);
        formData.append("name", "Alan Turing");
        // Promise
        const request = fetch("/uploadImage", {
            method: "post",
            body: formData
        });
        return request;
    }

    // btnSend.onclick = (evt)=>{
    // 	loader.style.visibility = "visible";		
    // 	const request = sendImage(); 
    // 	request
    // 		.then((result)=>{
    // 			console.log(result);
    // 			loader.style.visibility = "hidden";
    // 		})
    // 		.catch((err)=>{
    // 			console.log(err);
    // 			loader.style.visibility = "hidden";
    // 		});
    // }

    btnSend.onclick = async(evt) => {
        try {
            loader.style.visibility = "visible";
            const response = await sendImage();
            const content = await response.text();
            console.log(content)
            loader.style.visibility = "hidden";
        } catch (error) {
            console.log(error);
        }
    }
}
main();