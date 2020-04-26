from bs4 import BeautifulSoup
import requests
import re
import os

agent = 'Mozilla/5.0 (Windows NT 6.0; WOW64; rv:24.0) \
        Gecko/20100101 Firefox/24.0'
headers = {'User-Agent': agent}
base = "https://www.azlyrics.com/"

# base directory for cache files
cache = 'cache'


def get_artists(letter):
    if os.path.isfile(f'{cache}/artists/{letter}'):
        with open(f'{cache}/artists/{letter}', 'r') as f:
            return [l.strip() for l in f.readlines()]

    else:
        if letter.isalpha() and len(letter) is 1:
            letter = letter.lower()
            url = base + letter + ".html"
            req = requests.get(url, headers=headers)
            soup = BeautifulSoup(req.content, "html.parser")
            data = []
            art_link = []

            for div in soup.find_all("div", {"class": "container main-page"}):
                links = div.findAll('a')
                for a in links:
                    lnk = re.findall("\/(.+)\.html", a.attrs['href'])
                    if len(lnk) > 0:
                        data.append(a.text.strip())
                        art_link.append(lnk[0])

            os.makedirs(f'{cache}/artists', exist_ok=True)
            with open(f'{cache}/artists/{letter}_names', 'w+') as f1:
                with open(f'{cache}/artists/{letter}_url', 'w+') as f2:
                    f1.write('\n'.join(data))
                    f2.write('\n'.join(art_link))
            return data
        else:
            raise Exception("Unexpected Input")


def get_url(artist):
    with open(f'{cache}/artists/{artist[0]}_names', 'r') as f1:
        with open(f'{cache}/artists/{artist[0]}_url', 'r') as f2:
            for x, y in zip(f1.readlines(), f2.readlines()):
                if artist == x.strip('\n'):
                    return y.strip('\n')
    return None


def get_songs(artist):
    au = get_url(artist)
    first_char = au[0]

    sn = f'{cache}/songs/{first_char}/{au}_songs'
    snlk = f'{cache}/songs/{first_char}/{au}_songlink'

    if os.path.isfile(sn) and os.path.isfile(snlk):
        with open(sn) as f1:
            with open(snlk) as f2:
                return [l.strip() for l in f1.readlines()], [l.strip() for l in f2.readlines()]

    else:

        url = base + first_char + '/' + au + '.html'
        req = requests.get(url, headers=headers)

        soup = BeautifulSoup(req.content, 'html.parser')

        all_albums = soup.find('div', id='listAlbum')
        first_album = all_albums.find('div', class_='album')
        songs = []
        songs_link = []

        for tag in first_album.find_next_siblings(['a', 'div']):
            if tag.name == 'div' and tag.a:
                lnk = re.findall("\/([A-z0-9]+)\.html", tag.a.attrs['href'])
                if len(lnk) > 0:
                    songs.append(tag.a.text)
                    songs_link.append(lnk[0])

        os.makedirs(f'{cache}/songs/{first_char}', exist_ok=True)
        with open(sn, 'w+') as f1:
            f1.write('\n'.join(songs))
        with open(snlk, 'w+') as f2:
            f2.write('\n'.join(songs_link))

        return songs, songs_link


def get_lyrics(artist, song):

    au = get_url(artist)
    song = song.lower().replace(" ", "")
    sn = f'{cache}/lyrics/{au}/{song}'

    if os.path.isfile(sn):
        with open(sn) as f:
            return [l.strip() for l in f.readlines()]

    else:
        url = base + "lyrics/" + au + "/" + song + ".html"

        req = requests.get(url, headers=headers)
        soup = BeautifulSoup(req.content, "html.parser")
        lyrics = soup.find_all("div", attrs={"class": None, "id": None})
        if not lyrics:
            return {'Error': 'Unable to find ' + song + ' by ' + artist}
        elif lyrics:
            lyrics = lyrics[0].getText()
            lyrics = re.split('[\n\r]', lyrics)
            lyrics = [x for x in lyrics if x]
            os.makedirs(f'{cache}/lyrics/{au}', exist_ok=True)
            with open(sn, 'w+') as f:
                f.write('\n'.join(lyrics))
            return lyrics
