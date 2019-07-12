paypal.Button.render({
    
        env: 'production', // sandbox | production

        style: {
            size: 'medium',
            color: 'gold',
            shape: 'rect',
            label: 'checkout'
        },
    
        // PayPal Client IDs - replace with your own
        // Create a PayPal app: https://developer.paypal.com/developer/applications/create
        client: {
            production: 'AX92gB9LZzGHmwAmUty3WfYyPqnGtmQ4ArCYJb55aDH2HuyOIx-9jJpDvVbi8TNNl6yDfUi2013Y2OCW'
        },
    
        // Show the buyer a 'Pay Now' button in the checkout flow
        commit: true,
    
        // payment() is called when the button is clicked
        payment: function(data, actions) {
            var userId = my_cookie2("genel", "user_id");
            var option = $('#selectPlan').find(":selected").val();
            var price;
            var quantity;
            switch(option) {
                case '1': 
                    price = 5.99;
                    quantity = 1;
                    break;
                case '2':
                    price = 5.49;
                    quantity = 3;
                    break;
                case '3':
                    price = 4.99;
                    quantity = 6;
                    break;
                case '4':
                    price = 4.19;
                    quantity = 12;
            }
            var total = price * quantity;
            // Make a call to the REST api to create the payment
            return actions.payment.create({
                payment: {
                    transactions: [
                        {
                            custom: userId + '_' + price.toString() + '_' + quantity.toString(),
                            amount: { total: total.toString(), currency: 'USD' }
                        }
                    ]
                },
                experience: {
                    input_fields: {
                        no_shipping: 1
                    }
                }
            });
        },
        // onAuthorize() is called when the buyer approves the payment
        onAuthorize: function(data, actions) {
    
            // Make a call to the REST api to execute the payment
            return actions.payment.execute().then(function() {
                window.alert('Payment Complete! Please allow a few minutes for payment to get processed.');
            });
        }
    
    }, '#paypal-button-container');