
from flask import Flask, render_template, request, redirect, url_for

app = Flask(__name__)

products_data = [
    {
        "emoji": "🍅",
        "name": "Fresh Tomatoes",
        "price": 22,
        "quantity": 200,
        "farmer": "Ramesh Patil",
        "location": "Nashik"
    },
    {
        "emoji": "🥔",
        "name": "Organic Potatoes",
        "price": 18,
        "quantity": 350,
        "farmer": "Sunita Devi",
        "location": "Pune"
    },
    {
        "emoji": "🧅",
        "name": "Red Onions",
        "price": 24,
        "quantity": 150,
        "farmer": "Mahesh Rao",
        "location": "Ahmednagar"
    }
]

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/products")
def marketplace():
    return render_template("products.html", products=products_data)

@app.route("/farmer", methods=["GET", "POST"])
def farmer():
    if request.method == "POST":
        new_product = {
            "emoji": "🌾",
            "name": request.form["crop_name"],
            "price": request.form["price"],
            "quantity": request.form["quantity"],
            "farmer": "Ramesh Patil",
            "location": request.form["location"]
        }

        products_data.append(new_product)
        return redirect(url_for("marketplace"))

    return render_template("farmer_dashboard.html")

@app.route("/orders", methods=["GET", "POST"])
def orders():
    selected_product = request.values.get("product", "Fresh Tomatoes")
    selected_price = request.values.get("price", "22")

    if request.method == "POST":
        quantity = request.form["quantity"]
        total = int(quantity) * float(selected_price)
        confirmation = (
            f"Order placed successfully for {quantity} kg of {selected_product}. "
            f"Total: ₹{total:.0f}."
        )
        return render_template(
            "buyer_orders.html",
            selected_product=selected_product,
            selected_price=selected_price,
            confirmation=confirmation,
        )

    return render_template(
        "buyer_orders.html",
        selected_product=selected_product,
        selected_price=selected_price,
    )

@app.route("/admin")
def admin():
    return render_template("admin_dashboard.html")

if __name__ == "__main__":
    app.run(debug=True)
