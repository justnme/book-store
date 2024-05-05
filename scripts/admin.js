    document.querySelector('.btn').addEventListener('click', function(event) {
        event.preventDefault();
        
        let username = document.querySelector('input[type="email"]').value;
        let password = document.querySelector('input[type="password"]').value;
        
        

        if (username === username && password === password)  {
            alert('Logged');
        } else {
            alert('Not found');
        }
    });

    