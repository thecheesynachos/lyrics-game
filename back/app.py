from flask import Flask, jsonify
from flask_cors import CORS
from urllib.parse import unquote

from .lyrics_getter import generate_samples
from .azlyrics_scraper import get_artists, get_songs


app = Flask(__name__)
CORS(app)


@app.route('/artists/<c>', methods=['GET'])
def get_artists_with_char(c):
    lst = get_artists(c)
    return jsonify({'artists': lst})


@app.route('/questions/<artist>', methods=['GET'])
def get_questions(artist):
    artist = unquote(artist)
    songs, songs_link = get_songs(artist)
    lst = generate_samples(artist, songs, songs_link, s=7)
    return jsonify({
        'count': len(lst),
        'questions': lst
    })
