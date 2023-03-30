
async function getproductdata(image){
    localStorage.setItem("image",image);
    console.log(image);
}
const api_url = "http://localhost:3000/GetAllProducts";

// Defining async function
async function getapi(url) {
    const response = await fetch(url);

    var data = await response.json();
    console.log(data);
    show(data);
}

function show(allproduct) {
    allproduct.forEach(i => {
        onclickfun=getproductdata(i.image);
        markup =
            `<div onclick="${onclickfun}" class="col-xl-3 col-lg-6 col-md-6 col-sm-12 col-12 margin_10px">
            <div class="post-box">
                <div class="thumbnail-holder">
                    <a href="product/${i._id}">
                    <img src="${i.image}">
                    </a>
                </div>
                <div class="post-box-content">
                    <h3><a href="product/${i._id}">${i.product}</a></h3>
                    <div class="post-category">
                    <a href="#"> <i class="fa fa-list-alt"></i> ${i.selectCategory}</a>
                    </div>
                    <div class="post-meta">
                    ${i.price}
                    </div>
                    <div class="clearfix"></div>
                </div>
            </div>
        </div>`;
        document.querySelector("#Saman").insertAdjacentHTML("beforebegin", markup);
    });
}

getapi(api_url);
// afterbegin
// afterend
// beforebegin
// beforeend