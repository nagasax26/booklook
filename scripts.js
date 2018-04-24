//display the book in the HTML 
//display the first 10 Books that returns from the Data Base

// `<h1 class="display-3 font-weight-bold">`
// `</h1>`

// `<h3 class="display-4">Written By: <span class="bg-info">`
// `</span></h3>`

// `<p class="lead">`
// `</p>`

// `<img class="img-thumbnail"  src="`
// `" alt="`
// `">`


var books;


function getListOfBook(data, length) {
  var bookList = [];
  var title, author, description, image;

  if ('items' in data) {

    //reset
    title = "";
    author = "";
    description = "";
    image = "";
    for (var i = 0; i < length; i++) {
      if (data.items[i] != undefined) {
        if ("title" in data.items[i].volumeInfo)
          title = data.items[i].volumeInfo.title.trim();
        else
          title = "";
        if ("authors" in data.items[i].volumeInfo) {
          for (var item in data.items[i].volumeInfo.authors)
            author += data.items[i].volumeInfo.authors[item].trim() + ', ';

          author = author.substring(0, author.length - 2);
        } else
          author = "";
        if ("description" in data.items[i].volumeInfo)
          description = data.items[i].volumeInfo.description.trim();
        else
          description = "";
        if ("imageLinks" in data.items[i].volumeInfo)
          image = data.items[i].volumeInfo.imageLinks.thumbnail;
        else
          image = "";

        bookList.push({
          title: title,
          author: author,
          description: description,
          image: image
        });

        //reset the value for next use
        title = "";
        author = "";
        description = "";
        image = "";

      }
    }
    return bookList;
  }
}


$('.list-group').on('mouseover', 'li', function () {
  $(this).addClass('active');
  $(this).addClass('text-white');
  $(this).css('transition', 'all .2s');
});

$('.list-group').on('mouseleave', 'li', function () {
  $(this).removeClass('active');
  $(this).removeClass('text-white');
  $(this).find('span').css('text-decoration', 'none');
});


$('.list-group').on('mouseover', 'span', function () {
  $(this).css('text-decoration', 'underline');
  $(this).css('cursor', 'pointer');
  console.log('hovered');

});

$('.list-group').on('mouseleave', 'span', function () {
  $(this).css('text-decoration', 'none');
});

$('.list-group').on('click', 'span', function () {
  var index = $(this).parent().index();
  $('.modal-title').text(books[index].title);

  $('.modal-body').find('h4').text(books[index].description);
  if (books[index].author !== "")
    $('.modal-body').find('h3').find('span').text('Written BY: ' + books[index].author);
  $('.modal-body').find('img').attr('src', books[index].image);
});

$('input[type="text"]').focus(function () {
  var searchBy = $('select option:selected').val();
  if (searchBy === '3')
    $('input[type="text"]').css('border-bottom', '3px solid #ff7730');
  else
    $('input[type="text"]').css('border-bottom', '1px solid #ced4da');
});

$('input[type="text"]').keyup(function () {
  var searchBy = $('select option:selected').val();
  if (searchBy === '3')
    if (validateISBN())
      $('input[type="text"]').css('border-bottom', '3px solid #55c57a');
    else
      $('input[type="text"]').css('border-bottom', '3px solid #ff7730');
  else
    $('input[type="text"]').css('border-bottom', '1px solid #ced4da');
});

function validateISBN() {
  var patt = /\b[0-9]{10}\b/g;
  var search = $('input[type="text"]').val();
  return search.search(patt) !== -1;
}


function displayBook(data) {
  // $('#book').empty();
  $('.list-group').empty();



  books = getListOfBook(data, 10);

  if (books !== undefined) {

    console.log($('.list-group'));
    for (var i in books)
      $('.list-group').append('<li class="list-group-item"><span data-target="#popup-book" data-toggle="modal">' + books[i].title + '</span></li>');
  } else {
    $('.list-group').append('<h1>BOOK NOT EXIST</h1>');
  }


  // var bookLayout = `<div class="jumbotron">` + book.title + book.description + book.author + book.image + `</div>`;

  // $('#book').append(bookLayout);


}




$(document).ajaxStart(function () {
  $('.cla').css('display', 'block');
});


$(document).ajaxComplete(function () {
  $('.cla').css('display', 'none');
});

var fetch = function () {
  var search = $('input[type="text"]').val();
  var searchBy = $('select option:selected').val();
  if (searchBy === '1')
    searchBy = 'inauthor';
  else if (searchBy === '2')
    searchBy = 'intitle';
  else if (searchBy === '3') {
    searchBy = 'isbn';
    if (!validateISBN()) {
      alert('please enter a valid string');
      return;
    }
  } else {
    alert('please choose searching option');
    return;
  }


  // https://www.googleapis.com/books/v1/volumes?q=isbn:1897039468&key=AIzaSyDEzZxOobfVkEzYgPj1t5nbvIBUE2r23aE
  var url = 'https://www.googleapis.com/books/v1/volumes?q=' + searchBy + ':' + search + '&printType=books&key=AIzaSyDEzZxOobfVkEzYgPj1t5nbvIBUE2r23aE';



  $.ajax({
    method: "GET",
    url: url,
    success: function (data) {
      console.log(data);

      var amountLoaded = 0;
      // progressBarSim(amountLoaded,data);
      displayBook(data);



    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
    }
  });
};

//when the button search we want to call fetch
$('button[type="submit"]').click(fetch);