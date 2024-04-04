from flask import Flask, request, render_template_string, url_for

app = Flask(__name__)

@app.route('/weather', methods=['GET', 'POST'])
def weather():
    if request.method == 'POST':
        user_zip_code = request.form['zip_code']
        return render_template_string("""
            <link rel="stylesheet" href="{{ url_for('static', filename='style.css') }}">
            <h1>The weather in {{ zip_code }} is fabulous!</h1>
            <a href="/weather">Check another zip code</a>
            <button onclick="displayWeatherMessage()">Click me</button>
            <script src="{{ url_for('static', filename='script.js') }}"></script>
        """, zip_code=user_zip_code)

    # Render form for GET request
    else:
        return render_template_string("""
            <form method="post">
                Zip Code: <input type="text" name="zip_code">
                <input type="submit" value="Get Weather">
            </form>
            <script src="{{ url_for('static', filename='script.js') }}"></script>
        """)

if __name__ == '__main__':
    app.run(debug=True)
