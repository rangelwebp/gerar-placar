export async function getCroppedImage(imageSrc, pixelCrop) {
	const image = await createImage(imageSrc);
	const canvas = document.createElement("canvas");
	const context = canvas.getContext("2d");

	if (!context) {
		throw new Error("Não foi possível obter o contexto do canvas.");
	}

	const cropX = Math.round(pixelCrop.x);
	const cropY = Math.round(pixelCrop.y);
	const cropWidth = Math.round(pixelCrop.width);
	const cropHeight = Math.round(pixelCrop.height);

	canvas.width = cropWidth;
	canvas.height = cropHeight;

	context.imageSmoothingEnabled = true;
	context.imageSmoothingQuality = "high";

	context.drawImage(
		image,
		cropX,
		cropY,
		cropWidth,
		cropHeight,
		0,
		0,
		cropWidth,
		cropHeight,
	);

	return canvas.toDataURL("image/png");
}

function createImage(url) {
	return new Promise((resolve, reject) => {
		const image = new Image();
		image.addEventListener("load", () => resolve(image));
		image.addEventListener("error", (error) => reject(error));
		image.setAttribute("crossOrigin", "anonymous");
		image.src = url;
	});
}
