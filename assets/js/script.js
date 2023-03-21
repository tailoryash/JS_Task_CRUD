// validation of product form

function validateForm() {
  var id = document.getElementById("product_id").value;
  var name = document.getElementById("product_name").value;
  var image = document.getElementById("product_image").files[0];
  // console.log(image);
  
  var price = document.getElementById("product_price").value;
  var desc = document.getElementById("product_desc").value;

  if (id.toString().length < 2) {
    alert("Product id must be greater than 2 digits");
    return false;
  }

  if (!name) {
    alert("Name is Required");
    return false;
  }

  if (!image) {
      alert("Please Upload Image");
  }

  if (price < 0) {
    alert("Price must not be Zero or less than Zero");
    return false;
  }

  if (!desc) {
    alert("Description is required");
    return false;
  }

  return true;
}

// function to show data from localStorage
function showData() {
  // var imagePath = document.getElementById("product_image").files[0].name;
  var productList;
  if (localStorage.getItem("productList") == null) {
    productList = [];
  } else {
    productList = JSON.parse(localStorage.getItem("productList"));
  }

  var html = "";
  productList.forEach(function (product, index) {
    html += "<tr>";
    html += "<td>" + product.id + "</td>";
    html += "<td>" + product.name + "</td>";
    html += `<td><img src="${product.image}" width='30px' height='30px'/></td>`;
    html += "<td>" + product.price + "</td>";
    html += "<td>" + product.desc + "</td>";

    html +=
      '<td> <button onclick = "deleteData(' +
      index +
      ')" class="btn btn-danger">Delete</button><button onclick = "updateData(' +
      index +
      ')" class="btn btn-warning m-2">Edit</button></td>';
    html += "</tr>";
  });

  document.querySelector("#crudOp tbody").innerHTML = html;
}

// loads all data of product from localStorage
document.onload = showData();

async function getBlob(file){
  
  return new Promise((resolve,reject) => {
    const reader = new FileReader()
    reader.onload = function(e) {
      resolve(e.target.result)
    }
    
    reader.readAsDataURL(file)
  })



}

// adding data of product if validation == true
async function addData() {
  if (validateForm()) {
    var id = document.getElementById("product_id").value;
    var name = document.getElementById("product_name").value;
    var image = document.getElementById("product_image").files[0];
    const imageName = image.name
    // var imagePath = document.ge0tElementById("product_image").value;
    var price = document.getElementById("product_price").value;
    var desc = document.getElementById("product_desc").value;

    image = await getBlob(image)
    console.log(image);

    var productList;
    if (localStorage.getItem("productList") == null) {
      productList = [];
    } else {
      productList = JSON.parse(localStorage.getItem("productList"));
    }

    productList.push({
      id,
      name,
      imageName,
      image,
      price,
      desc
    });

    localStorage.setItem("productList", JSON.stringify(productList));
    showData();
    document.getElementById("product_id").value = "";
    document.getElementById("product_name").value = "";
    document.getElementById("product_image").files = (new DataTransfer()).files;
    document.getElementById("product_price").value = "";
    document.getElementById("product_desc").value = "";
  }
}

//deleting product's details from localStorage
function deleteData(index) {
  var productList;
  if (localStorage.getItem("productList") == null) {
    productList = [];
  } else {
    productList = JSON.parse(localStorage.getItem("productList"));
  }

  productList.splice(index, 1);
  localStorage.setItem("productList", JSON.stringify(productList));
  showData();
}

//function to edit and update details of product from localstorage and save changes
async function updateData(index) {
  document.getElementById("Submit").style.display = "none";
  document.getElementById("Update").style.display = "block";

  var productList;
  if (localStorage.getItem("productList") == null) {
    productList = [];
  } else {
    productList = JSON.parse(localStorage.getItem("productList"));
  }

  document.getElementById("product_id").value = productList[index].id;
  document.getElementById("product_name").value = productList[index].name;
  document.getElementById("product_price").value = productList[index].price;
  const dataTransfer = new DataTransfer();
  dataTransfer.items.add(new File([productList[index].image], productList[index].imageName, {
    type: 'image/png',
  }));
  document.getElementById("product_image").files = dataTransfer.files
  
  document.getElementById("product_desc").value = productList[index].desc;

  document.querySelector("#Update").onclick = async function () {
    if (validateForm() == true) {
      productList[index].id = document.getElementById("product_id").value;
      productList[index].name = document.getElementById("product_name").value;
      productList[index].price = document.getElementById("product_price").value;
      var image = document.getElementById("product_image").files[0];
      productList[index].imageName = image.name;
      // productList[index].image = document.getElementById("product_image").files[0].name;
      // productList[index].imagePath = document.getElementById("product_image").value;
      productList[index].desc = document.getElementById("product_desc").value;
      productList[index].image = await getBlob(image)
    // console.log(image);
      localStorage.setItem("productList", JSON.stringify(productList));
      showData();

      document.getElementById("product_id").value = "";
      document.getElementById("product_name").value = "";
      document.getElementById("product_image").value = "";
      document.getElementById("product_price").value = "";
      document.getElementById("product_desc").value = "";

      document.getElementById("Submit").style.display = "block";
      document.getElementById("Update").style.display = "none";
    }
  };
}

//filtering product by id
function filter(){
  var filterIn = document.getElementById("filterProduct").value;
  var table = document.querySelectorAll("#crudOp");

  for (i = 0; i < table.length; i++) {
		var td = table[i].getElementsByTagName("td")[0];

		if (td) {
			var txtValue = td.innerHTML;

			if (txtValue.indexOf(filterIn) > -1) {
				table[i].style.display = "";
			} else {
				table[i].style.display = "none";
			}
		}
	}
}

//sorting product by id, name, price


function sortProduct(){
    var productList;
    let sortingVal = document.getElementById("sorting").value;
    if(localStorage.getItem("productList") == null){
        productList = [];
    }else {
      productList = JSON.parse(localStorage.getItem("productList"));
    }

    switch(sortingVal){
      case "p_id":
        productList.sort(byProductId);
        break;
      case "p_name": 
        productList.sort(byProductName);
        break;
      case "p_price":
        productList.sort(byProductPrice);
        break;
    }

    localStorage.setItem("productList", JSON.stringify(productList));
    location.reload();
    showData();
}

function byProductId(a, b){
  return a.id - b.id;
}

function byProductName(a, b){
  if(a.name < b.name) return -1;
  else if(a.name > b.name) return 1;
  else return 0;
}

function byProductPrice(a, b){
  return a.price - b.price;
}

//clear all localstorage data
function clearall(){
  localStorage.clear();
  window.location.reload();
  showData();
}