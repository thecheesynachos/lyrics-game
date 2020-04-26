from .azlyrics_scraper import *
import random


def generate_one_sample(artist, songs_list, songs_link, ln=2, n=4):
    choices = []
    options = []
    while len(set(options)) != n:
        choices = random.sample(range(len(songs_list)), n)
        options = [songs_list[i] for i in choices]
    ans = songs_list[choices[0]]
    lyrics_cut = ans
    lyrics = get_lyrics(artist, songs_link[choices[0]])
    while ans.lower() in lyrics_cut.lower():
        ln_num = random.randint(0, len(lyrics) - ln)
        lyrics_cut = ' // '.join(lyrics[ln_num:ln_num+ln])
    random.shuffle(options)
    return {
        'lyrics': lyrics_cut,
        'options': options,
        'correct': ans
    }


def generate_samples(artist, songs_list, songs_link, s=10, ln=2, n=4):
    return [generate_one_sample(artist, songs_list, songs_link, ln=ln, n=n) for _ in range(s)]
