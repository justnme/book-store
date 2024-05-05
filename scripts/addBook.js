function load_Image(element){ //Load image to hbs
    document.getElementById("image").src = window.URL.createObjectURL(element.files[0]);
}

const quill = new Quill('#bookDescription', {
    placeholder: 'Book description text',
    theme: 'snow',
  });
// test function
//   function check(){
// 	 const book_description = document.getElementById('bookDescription'); 
//  	 console.log('Book description received:', book_description);
//   }


const saveForm =  document.getElementById("saveForm")
saveForm.addEventListener("submit", submitForm);

function submitForm(e){
	e.preventDefault();
	const bookTitle = document.getElementById("bookTitle");
	const bookImage = document.getElementById("bookImage");
	const bookAuthor = document.getElementById("bookAuthor");
	const bookPrice = document.getElementById("bookPrice");
	const bookDate = document.getElementById("bookDate");
	const bookGenre = document.getElementById("bookGenre");
	const tags1 = document.getElementById("tags1");
	const tags2 = document.getElementById("tags2");
	const tags3 = document.getElementById("tags3");
	const tags4 = document.getElementById("tags4");
	const tags5 = document.getElementById("tags5");
	const bookDescription = quill.root.innerHTML;
		// console.log(bookDescription)
	const formData = new FormData();
	formData.append("bookTitle", bookTitle.value);
	formData.append("bookAuthor", bookAuthor.value);
	formData.append("bookPrice", bookPrice.value);
	formData.append("bookDate", bookDate.value);
	formData.append("bookGenre", bookGenre.value);
	formData.append("tags1", tags1.value);
	formData.append("tags2", tags2.value);
	formData.append("tags3", tags3.value);
	formData.append("tags4", tags4.value);
	formData.append("tags5", tags5.value);
    formData.append("bookDescription", bookDescription);
		// console.log(bookDescription.value)

    formData.append("bookImage", bookImage.files[0]);
	
	fetch('http://localhost:3000/addBook', {
		method: 'POST',
        body: formData
	})
	.then((res) => {
		if (res.ok) {
			alert('Book added successfully');
			document.getElementById("saveForm").reset();
				} else {
			console.error('Failed to add book');
		}
	})
		.catch((err) => ("Error occured", err));
}