//display the book in the HTML 
function dispalyBook(data){

    var book = {
        title: data.items[0].volumeInfo.title,
        author: data.items[0].volumeInfo.authors[0],
        description:data.items[0].volumeInfo.description,
        image:data.items[0].volumeInfo.imageLinks.thumbnail
    };
var bookLayout = `
              <h1 id="title">`+book.title+`</h1>
              <p id="description">`+book.description+`</p>
              <h3 id="author">Written By: `+book.author+`</h3>
              <img id="image" src="`+book.image+`" alt="`+book.title+`">
    `;

    $('#book').empty();
    $('#book').append(bookLayout);
    
    
}



var fetch = function () {
    var isbn = $('input[type="text"]').val();
    // console.log(isbn);
    // https://www.googleapis.com/books/v1/volumes?q=isbn:1897039468&key=AIzaSyDEzZxOobfVkEzYgPj1t5nbvIBUE2r23aE
    var url = 'https://www.googleapis.com/books/v1/volumes?q=isbn:'+isbn+'&key=AIzaSyDEzZxOobfVkEzYgPj1t5nbvIBUE2r23aE';
    $.ajax({
      method: "GET",
      url: url,
      success: function(data) {
        console.log(data);
        
        dispalyBook(data);

         


      },
      error: function(jqXHR, textStatus, errorThrown) {
        console.log(textStatus);
      }
    }); 
  };

  //when the button search we want to call fetch
  $('button[type="submit"]').click(fetch);