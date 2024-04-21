function Load_Image(element){
	console.log("Hello?");
	element.parentElement.children[0].src = window.URL.createObjectURL(element.files[0]);
}