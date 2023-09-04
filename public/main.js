function deleteProduct(id){
    const result = confirm("Are you sure you want to delete this product?"); // Confirm('') returns a boolean value
    if (result){
        fetch('/delete/' + id, { // This fetch api sends a 'POST' request at the URL 'delete/id' to the user and receives a response.
            method: 'POST'       // 
        }).then(function(res){
            if(res.ok){
                location.reload(); // It reloads with the response received from the '/delete/id' URL.
            }
        })
    }
}

// Note - When we 'go' to any particular URL, a default 'GET' request is sent by the browser to the server.
// It is not any kind of request but a default 'GET' request.