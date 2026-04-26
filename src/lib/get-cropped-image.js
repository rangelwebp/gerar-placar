export async function getCroppedImage(imageSrc, pixelCrop) {
	const image = await createImage(imageSrc);
	const canvas = document.createElement("canvas");
	const context = canvas.getContext("2d");

	if (!context) {
		throw new Error("Não foi possível obter o contexto do canvas.");
	}

	canvas.width = pixelCrop.width;
	canvas.height = pixelCrop.height;

	context.drawImage(
		image,
		pixelCrop.x,
		pixelCrop.y,
		pixelCrop.width,
		pixelCrop.height,
		0,
		0,
		pixelCrop.width,
		pixelCrop.height,
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
