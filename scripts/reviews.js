const quill = new Quill('#reviewMessage', {
    placeholder: 'Write your review here',
    theme: 'snow',
  });

document.getElementById('add_review').addEventListener('submit', function(event) {
    event.preventDefault();

    var reviewMessage = quill.root.innerHTML;
    console.log(reviewMessage)
    document.getElementById('review_message').value = reviewMessage;

    this.submit();
});
