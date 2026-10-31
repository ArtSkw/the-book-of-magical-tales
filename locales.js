export const uiText = {
  en: {
    pageCount: (page, total) => `Page ${page} of ${total}`,
    choiceHint: "Decide what to do and continue the story.",
    restartStory: "Begin again",
    soundLabel: "Sound",
    soundOn: "Sound on",
    soundOff: "Sound off"
  },
  pl: {
    pageCount: (page, total) => `Strona ${page} z ${total}`,
    choiceHint: "Zdecyduj, co zrobić, i kontynuuj historię.",
    restartStory: "Zacznij od nowa",
    soundLabel: "Dźwięk",
    soundOn: "Dźwięk włączony",
    soundOff: "Dźwięk wyłączony"
  }
};

export const storyTranslations = {
  pl: {
    "dragon-bridge": {
      shortTitle: "Smoczy Most",
      title: "Smok na starym moście",
      kicker: "Opowieść o słuchaniu",
      pages: [
        {
          title: "Nieoczekiwane spotkanie",
          body: [
            "Pod wieczór rycerz Gustaw i mała Oliwia doszli do starego kamiennego mostu. Pod jego jedynym łukiem szemrał potok. Od niepamiętnych czasów chodziły tędy konie objuczone sakwami, młynarze z workami mąki i dzieci, które niosły mleko do wioski.",
            "Tego wieczoru na samym środku mostu siedział miedziany smok. Jak na smoka był nieduży, mniej więcej wielkości konia. Nie ryczał i nikogo nie straszył. Przednie łapy oparł o murek, a ogonem otulał jeden obluzowany kamień.",
            "„To mostowy smok” – szepnął Gustaw. „Dziadek mi o nich opowiadał. Pilnują starych przepraw, ale nigdy nikomu nie zagradzają drogi. Skoro ten zagradza, coś musi być nie tak”."
          ],
        },
        {
          title: "Mała niespodzianka",
          body: [
            "Gustaw przyklęknął i oparł tarczę o kolano, żeby wydać się smokowi mniejszy. Oliwia stanęła tuż przy nim i wstrzymała oddech.",
            "Smok pochylił się nad murkiem i chuchnął na obluzowany kamień. Z jego nozdrzy wypłynęła złota smużka i osiadła na mchu powoli, bardzo powoli. Mostowe smoki nie zieją ogniem, tylko ciepłem, które grzeje kamień, ale nikogo nie parzy.",
            "Wtedy spod kamienia dobiegło cichutkie: pi, pi, pi. Smok podniósł oczy na wędrowców, jakby sprawdzał, czy też to usłyszeli."
          ],
          choices: [
            {
              label: "Zapytaj, czego pilnuje",
              response: "Oliwia podejdzie bliżej i łagodnie zapyta smoka, czego tak pilnuje."
            },
            {
              label: "Poczekaj i posłuchaj",
              response: "Oliwia i Gustaw zastygną w ciszy i posłuchają, co piszczy pod kamieniem."
            }
          ],
        },
        {
          title: "Kamień z sekretem",
          bodyByChoice: {
            1: {
              ask: [
                "Oliwia podeszła bliżej. „Czego tak pilnujesz?” – zapytała łagodnie. Smok długo jej się przyglądał. Potem położył pazur na obluzowanym kamieniu i ostrożnie uchylił jego brzeg.",
                "Pod spodem, w wąskiej szczelinie, wśród mchu, wapna i korzonków trawy, było gniazdko rzecznych myszek. Trzy myszki tuliły się do siebie, a najmniejsza drżała.",
                "Każdy krok na moście trząsł obluzowanym kamieniem, a razem z nim gniazdkiem. A o świcie przez most miały przejechać ciężkie wozy na targ. „Smok nie zagrodził drogi ze złości” – szepnęła Oliwia. „Pilnuje myszek, bo nie umie nikomu powiedzieć, że tu mieszkają”."
              ],
              listen: [
                "Oliwia położyła się na bruku i przyłożyła ucho do murka. Czekała w ciszy, aż znów coś piśnie. Pisk dochodził z wąskiej szczeliny pod obluzowanym kamieniem.",
                "Ze szczeliny wyjrzały trzy rzeczne myszki. Mieszkały w gniazdku wciśniętym między mech, wapno i korzonki trawy. Smok położył się obok Oliwii i razem z nią patrzył, jak najmniejsza drży.",
                "Każdy krok na moście trząsł obluzowanym kamieniem, a razem z nim gniazdkiem. A o świcie przez most miały przejechać ciężkie wozy na targ. „Smok nie zagrodził drogi ze złości” – szepnęła Oliwia. „Pilnuje myszek, bo nie umie nikomu powiedzieć, że tu mieszkają”."
              ]
            }
          },
        },
        {
          title: "Latarnia i chleb",
          body: [
            "Wieczór robił się chłodny, a znad potoku podnosiła się mgła. Gniazdko trzeba było przenieść, zanim nadjadą wozy. Tylko że myszki nie znały wędrowców i łatwo mogły się spłoszyć.",
            "Gustaw zapalił latarnię. Oliwia wyjęła z torby pół bochenka żytniego chleba zawiniętego w płótno. Smok oddychał tak delikatnie, że nie zgasiłby nawet świecy.",
            "„Najpierw muszą nam zaufać” – powiedział cicho Gustaw. „Niech zobaczą, że nic im nie grozi”."
          ],
          choices: [
            {
              label: "Unieś latarnię",
              response: "Gustaw uniesie latarnię, żeby myszki widziały, kto przy nich klęczy."
            },
            {
              label: "Podziel się chlebem",
              response: "Oliwia ukruszy trochę chleba tuż przy szczelinie."
            }
          ],
        },
        {
          title: "Czerwony proporzec",
          bodyByChoice: {
            3: {
              lantern: [
                "Gustaw uniósł latarnię. W jej świetle widać było każdy omszały kamień i trzy pary błyszczących oczek. Myszki patrzyły to na światło, to na wędrowców, ale żadna nie uciekła.",
                "Do przeprowadzki potrzeba było więcej rąk, więc Gustaw zatknął przy ścieżce do młyna czerwony proporzec. Kiedy rycerz stawia go przy drodze, wszyscy w okolicy wiedzą, że potrzebuje pomocy.",
                "Przyszli ci, którzy byli najbliżej, i każde z tym, co akurat miało w rękach: młynarz z naręczem owczej wełny, piekarka z czystą chustą i wikliniarz z pękiem trzcin ściętych nad potokiem. Latarnia pokazywała im, gdzie bezpiecznie postawić stopę."
              ],
              bread: [
                "Oliwia ukruszyła trochę chleba i położyła okruszki na płótnie, tuż przy szczelinie. Najpierw wysunął się jeden nosek, potem drugi, a na końcu trzeci. Myszki jadły i coraz śmielej patrzyły na Oliwię.",
                "Do przeprowadzki potrzeba było więcej rąk, więc Gustaw zatknął przy ścieżce do młyna czerwony proporzec. Kiedy rycerz stawia go przy drodze, wszyscy w okolicy wiedzą, że potrzebuje pomocy.",
                "Przyszli ci, którzy byli najbliżej, i każde z tym, co akurat miało w rękach: młynarz z naręczem owczej wełny, piekarka z czystą chustą i wikliniarz z pękiem trzcin ściętych nad potokiem. Stanęli z boku, żeby nie płoszyć myszek przy kolacji."
              ]
            }
          },
          curiosityNoteByChoice: {
            3: {
              lantern: {
                title: "Czy wiesz, że...?",
                body: "Dawne latarnie nie miały szybek ze szkła, bo szkło było bardzo drogie. Wstawiano w nie cieniutkie płytki z krowiego rogu, zeskrobane tak, że przeświecało przez nie złote światło."
              },
              bread: {
                title: "Czy wiesz, że...?",
                body: "W średniowieczu gruba kromka czerstwego chleba często służyła za talerz. Kładziono na niej mięso i kaszę, a po uczcie taki chlebowy talerz oddawano biednym albo psom."
              }
            }
          },
        },
        {
          title: "Kołyska z trzciny i mchu",
          body: [
            "Wikliniarz od razu wiedział, co robić. Uplótł z trzcin kołyskę, okrągłą i głęboką, z wysokim brzegiem, żeby żadna myszka nie wypadła w drodze. Młynarz wyścielił ją wełną, a piekarka swoją chustą.",
            "Smok pochylił pysk i ogrzał kołyskę jednym maleńkim chuchnięciem. Myszki przyglądały się z murka. Wąsiki im drżały, ale żadna nie schowała się do szczeliny.",
            "„Do środka muszą wejść same” – powiedział wikliniarz. „Jak weźmiemy je w ręce, przestraszą się i uciekną”."
          ],
          choices: [
            {
              label: "Ułóż ścieżkę z okruszków",
              response: "Oliwia ułoży z okruszków ścieżkę od szczeliny aż do kołyski."
            },
            {
              label: "Poproś smoka o ciepłą ścieżkę",
              response: "Oliwia poprosi smoka, żeby ogrzał kamienie od szczeliny aż do kołyski."
            }
          ],
        },
        {
          title: "Przeprowadzka maleńkich łapek",
          bodyByChoice: {
            5: {
              crumbs: [
                "Oliwia pokruszyła skórkę chleba i ułożyła z okruszków ścieżkę od szczeliny aż do kołyski. Pierwsza myszka szła okruszek po okruszku, aż weszła na wełnę. Za nią druga.",
                "Najmniejsza zatrzymywała się przy każdym okruszku i zjadała go do ostatniej okruszyny. Wikliniarz trzymał kołyskę nieruchomo, a Gustaw podsunął pod nią tarczę, żeby nic nie spadło.",
                "Kiedy wszystkie trzy siedziały w środku, wikliniarz z Gustawem przenieśli kołyskę w suchą trawę nad brzegiem, między trzciny. Smok mrugnął do nich powoli. „Tak mostowe smoki mówią »dziękuję«” – szepnął wikliniarz. „Mój dziadek też to kiedyś widział”."
              ],
              "warm-path": [
                "Smok pochylił się nad murkiem i chuchał na kamienie, jeden po drugim, od szczeliny aż do kołyski. Kamienie nagrzały się i zajaśniały od środka bursztynowo, jak węgielki, które już nie parzą.",
                "Pierwsza myszka przeszła po ciepłych kamieniach i weszła na wełnę. Za nią druga. Najmniejsza ruszyła na końcu, a smok prowadził ją nosem. Wikliniarz trzymał kołyskę, a Gustaw podsunął pod nią tarczę.",
                "Kiedy wszystkie trzy siedziały w środku, wikliniarz z Gustawem przenieśli kołyskę w suchą trawę nad brzegiem, między trzciny. Smok mrugnął do nich powoli. „Tak mostowe smoki mówią »dziękuję«” – szepnął wikliniarz. „Mój dziadek też to kiedyś widział”."
              ]
            }
          },
          curiosityNote: {
            title: "Czy wiesz, że...?",
            body: "Badylarka, najmniejsza polska mysz, waży tyle co moneta. Wysoko w trzcinach plecie okrągłe gniazdko z żywych źdźbeł, a ogonkiem trzyma się łodyg jak piątą łapką."
          },
        },
        {
          title: "Obietnica na starym moście",
          body: [
            "Kiedy myszki były już bezpieczne, smok zszedł z drogi i most znów stał otworem. Na murku zostało kilka okruszków, w sam raz na śniadanie dla wróbli.",
            "Młynarz obiecał, że nazajutrz osadzi kamień na nowo. Na naprawę pójdą mostowe grosze od wędrowców. A Oliwia obiecała smokowi, że w gospodzie poprosi każdego wędrowca: „Powoli i cicho, przy moście śpią myszki”.",
            "W oknach gospody na wzgórzu zapalały się już świece. Smok patrzył na wędrowców i nie bardzo wiedział, jak się pożegnać. Od dawna nikt nie został na jego moście tak długo."
          ],
          paragraphByChoice: {
            5: {
              crumbs: {
                0: "Kiedy myszki były już bezpieczne, smok zszedł z drogi i most znów stał otworem. Na murku zostało kilka okruszków, w sam raz na śniadanie dla wróbli."
              },
              "warm-path": {
                0: "Kiedy myszki były już bezpieczne, smok zszedł z drogi i most znów stał otworem. Kamienie na murku stygły powoli i gasły jeden po drugim."
              }
            }
          },
          choices: [
            {
              label: "Podziękuj smokowi",
              response: "Oliwia podziękuje smokowi za to, że tak długo pilnował najmniejszych."
            },
            {
              label: "Pomachaj na dobranoc",
              response: "Oliwia pomacha smokowi i powie mu dobranoc."
            }
          ],
        },
        {
          title: "Szeptem przez most",
          bodyByChoice: {
            7: {
              "name-promise": [
                "Oliwia stanęła przed smokiem. „Dziękuję, że tak długo pilnowałeś najmniejszych” – powiedziała. Smok pochylił łeb, strząsnął z boku jedną miedzianą łuskę i ciepłym oddechem osadził ją w murku, tuż przy dawnym mysim domu.",
                "Nocą łuska świeciła w murku bursztynowo. Oliwia dotrzymała słowa i od tej nocy każdy, kto szedł przez most, zwalniał przy łusce i szeptał: „Powoli i cicho, przy moście śpią myszki”. A smok czuwał przy kołysce z otwartymi oczami.",
                "Tej nocy Oliwia zasypiała w gospodzie z maleńkim trzcinowym koszyczkiem w dłoni. Wikliniarz uplótł go dla niej na pamiątkę, z trzcin, które zostały po kołysce."
              ],
              "wave-goodnight": [
                "Oliwia pomachała smokowi ręką. „Dobranoc, smoku” – powiedziała. Smok mrugnął sennie, zwinął się wokół kołyski i zasnął, pierwszy raz od dnia, w którym obluzował się kamień.",
                "Z każdym jego oddechem nad kołyską unosiła się smużka złotego ciepła. Oliwia dotrzymała słowa, więc ludzie szli przez most na palcach i uciszali się szeptem: „Powoli i cicho, przy moście śpią myszki”.",
                "Tej nocy Oliwia zasypiała w gospodzie z maleńkim trzcinowym koszyczkiem w dłoni. Wikliniarz uplótł go dla niej na pamiątkę, z trzcin, które zostały po kołysce."
              ]
            }
          },
          curiosityNote: {
            title: "Czy wiesz, że...?",
            body: "W dawnej Polsce za przejście przez most trzeba było czasem zapłacić. Taką opłatę nazywano mostowym, a pieniądze miały iść na naprawę mostu."
          },
        },
        {
          title: "Co mówią w gospodzie",
          body: [
            "Długo po tym, jak w gospodzie zgasły świece, przy starym moście czuwał smok. Obok niego, w trzcinowej kołysce, spały myszki, a w murku świeciła miedziana łuska. O świcie wozy na targ przejechały przez most powoli i cicho, wóz za wozem.",
            "Od tamtej pory w gospodzie mówi się: „Zanim każesz smokowi zejść z drogi, zapytaj go, czego pilnuje”. I nikt jeszcze nie pożałował, że zapytał.",
            "Koniec."
          ],
          paragraphByChoice: {
            7: {
              "name-promise": {
                0: "Długo po tym, jak w gospodzie zgasły świece, przy starym moście czuwał smok. Obok niego, w trzcinowej kołysce, spały myszki, a w murku świeciła miedziana łuska. O świcie wozy na targ przejechały przez most powoli i cicho, wóz za wozem."
              },
              "wave-goodnight": {
                0: "Długo po tym, jak w gospodzie zgasły świece, przy starym moście spał smok. Obok niego, w trzcinowej kołysce, spały myszki, otulone ciepłem jego oddechu. O świcie wozy na targ przejechały przez most powoli i cicho, wóz za wozem."
              }
            },
            1: {
              ask: {
                1: "Od tamtej pory w gospodzie mówi się: „Zanim każesz smokowi zejść z drogi, zapytaj go, czego pilnuje”. I nikt jeszcze nie pożałował, że zapytał."
              },
              listen: {
                1: "Od tamtej pory w gospodzie mówi się: „Zanim każesz smokowi zejść z drogi, posłuchaj, co piszczy pod kamieniem”. I nikt jeszcze nie pożałował, że posłuchał."
              }
            }
          },
        }
      ]
    },
    "moonhill-bell": {
      shortTitle: "Księżycowy Dzwon",
      title: "Dzwon z Księżycowego Wzgórza",
      kicker: "Opowieść o naprawianiu",
      pages: [
        {
          title: "Gdy dzwon nie zawołał",
          body: [
            "Gustaw, Oliwia i klacz Koniczynka dotarli na Księżycowe Wzgórze tuż przed zmierzchem. Na dachu dzwonnicy obracał się żelazny sierp księżyca i pokazywał, skąd wieje wiatr. To od niego wzgórze wzięło nazwę.",
            "Co wieczór dzwon wołał stąd ludzi do domów, a dzieci powtarzały za nim: „Bim-bam, do domu!”. Tego wieczoru dzwonnica milczała. Rodziny wyszły na plac z rogowymi latarniami i patrzyły w górę.",
            "„Pasterz Maciej jest jeszcze z kozami pod górami” – powiedział z troską wójt. „We mgle nie zejdzie, póki nie usłyszy dzwonu”. Tymczasem Koniczynka wyciągała pysk ku staremu sadowi, gdzie między gruszami połyskiwały srebrne ćmy."
          ],
          curiosityNote: {
            title: "Czy wiesz, że...?",
            body: "W średniowieczu wieczorny dzwon przypominał też, żeby przykryć ogień w palenisku, bo nocą łatwo o pożar. Francuzi nazywali go „couvre-feu”, czyli „przykryj ogień”."
          },
        },
        {
          title: "Klucz, lina i koński nos",
          body: [
            "Wójt otworzył drzwi dzwonnicy wielkim żelaznym kluczem. Piekarz zajrzał do środka i zadarł głowę. „Liny nie ma!” – zawołał. „Zawsze zwisała tu aż do samej podłogi”.",
            "Wszyscy mówili naraz. Tylko Oliwia patrzyła na Koniczynkę, która strzygła uszami ku gruszom. „Gdzie krążą srebrne ćmy, tam coś czeka na naprawę” – szepnęła jakaś dziewczynka z wioski.",
            "Babcia Janina wsparła się na lasce. „Albo górski wiatr znowu nabroił. Po południu wiało tak, że dzwon sam pobrzękiwał, a sierp na dachu kręcił się w kółko”."
          ],
          choices: [
            {
              label: "Idź za Koniczynką",
              response: "Wszyscy pójdą za klaczą tam, gdzie krążą srebrne ćmy."
            },
            {
              label: "Zapytaj starszych",
              response: "Babcia Janina opowie, czego szukać po wietrznym popołudniu."
            }
          ],
        },
        {
          title: "Lina w gałęziach gruszy",
          bodyByChoice: {
            1: {
              "follow-clover": [
                "Koniczynka poprowadziła wszystkich wokół wieży, prosto pod starą gruszę. Srebrne ćmy krążyły tam nad grubą gałęzią, która sięgała aż do okiennicy.",
                "Na gałęzi wisiała lina od dzwonu, splątana w ciasne pętle. Wiatr wywiał ją przez otwartą okiennicę i owinął wokół gałęzi.",
                "Tuż obok, w rozwidleniu, było gniazdko z mchu. Zięba grzała w nim trzy pisklęta i nie odleciała, choć pod drzewem stało pół wioski. Wystarczyło mocniej szarpnąć liną, a gniazdko spadłoby z gałęzi."
              ],
              "ask-elders": [
                "Babcia Janina od razu sobie przypomniała. „Kiedy byłam mała, wiatr też raz porwał linę” – powiedziała. „Znaleźliśmy ją w starej gruszy. Ta grusza zawsze wyciąga gałęzie ku dzwonnicy”.",
                "Poszli za nią wokół wieży. Babcia uniosła laskę i pokazała grubą gałąź, która sięgała aż do okiennicy. Wisiała na niej lina od dzwonu, splątana w ciasne pętle.",
                "Tuż obok, w rozwidleniu, było gniazdko z mchu. Zięba grzała w nim trzy pisklęta i nie odleciała, choć pod drzewem stało pół wioski. Wystarczyło mocniej szarpnąć liną, a gniazdko spadłoby z gałęzi."
              ]
            }
          },
        },
        {
          title: "Cicho przy gnieździe",
          body: [
            "Cieśla przyniósł jesionową drabinę i oparł ją o pień powoli, żeby nie stuknęła o korę tuż pod gniazdem. Piekarz owinął płótnem nogi drabiny, żeby nie zgrzytały o kamienie.",
            "Zięba patrzyła na nich czarnymi oczkami, ale nie zeszła z gniazda. Oliwia nie spuszczała z niej wzroku, a Koniczynka stała bez ruchu i nawet nie parsknęła.",
            "„Jak zięba się spłoszy, pisklęta zmarzną” – szepnął cieśla. „Linę trzeba rozplątać tak, żeby ptaszka nie spłoszyć”."
          ],
          choices: [
            {
              label: "Rozplątuj powoli",
              response: "Cieśla będzie rozplątywał pętle jedną po drugiej, bez jednego szarpnięcia."
            },
            {
              label: "Zanućcie ziębie kołysankę",
              response: "Oliwia i Gustaw zanucą cichutko, żeby zięba czuła się bezpiecznie."
            }
          ],
        },
        {
          title: "Wolna lina, zachrypnięty dzwon",
          bodyByChoice: {
            3: {
              "move-slowly": [
                "Cieśla wspiął się po drabinie i rozplątywał linę pętla po pętli, bez jednego szarpnięcia. Oliwia stała na dole i liczyła pętle szeptem: pięć, cztery, trzy, dwie, jedna.",
                "Kiedy puścił ostatni supeł, zięba wciąż grzała pisklęta. Z gałęzi spadł liść gruszy, prosto na rękaw Oliwii. Oliwia schowała go do torby, obok trzcinowego koszyczka znad mostu.",
                "Lina znów zwisała w wieży. Ale kiedy cieśla za nią pociągnął, zamiast „bim-bam” rozległ się chrapliwy brzęk. Dzwon zachrypł."
              ],
              "lullaby": [
                "Oliwia i Gustaw zaczęli cichutko nucić kołysankę, a cieśla na drabinie luzował linę w jej rytmie, pętla po pętli. Zięba przymknęła oczy i ani drgnęła.",
                "Kiedy puścił ostatni supeł, kołysanka ucichła, a zięba wciąż grzała pisklęta. Z gałęzi spadł liść gruszy, prosto na rękaw Oliwii. Oliwia schowała go do torby, obok trzcinowego koszyczka znad mostu.",
                "Lina znów zwisała w wieży. Ale kiedy cieśla za nią pociągnął, zamiast „bim-bam” rozległ się chrapliwy brzęk. Dzwon zachrypł."
              ]
            }
          },
        },
        {
          title: "Pęknięcie i zapomniane imię",
          body: [
            "Na górze, w świetle latarni, zobaczyli na brzegu dzwonu pęknięcie cienkie jak włos. Po południu wiatr tak długo szarpał liną, że dzwon bił i bił, aż spiż nie wytrzymał.",
            "Cieśla dotknął pęknięcia dwoma palcami. „Kowalka umie spiąć spiż nitami” – powiedział. „Tylko że to robota na całą noc”.",
            "Babcia Janina pogładziła dzwon. „Kiedyś miał imię i była o nim rymowanka. Mówiła, co robić, kiedy zachrypnie. Gdybym tylko ją sobie przypomniała…”"
          ],
          choices: [
            {
              label: "Poproś kowalkę o pomoc",
              response: "Dzieci pobiegną po kowalkę, a ona przyniesie młoteczek i nity."
            },
            {
              label: "Przypomnijcie imię dzwonu",
              response: "Wszyscy pomogą babci Janinie przypomnieć sobie imię dzwonu i dawną rymowankę."
            }
          ],
        },
        {
          title: "Noc w dzwonnicy",
          bodyByChoice: {
            5: {
              "invite-smith": [
                "Kowalka przyszła z małym młoteczkiem i woreczkiem nitów. Przewierciła spiż przy pęknięciu i wbijała nity cichutko, stuk po stuku. Cieśla trzymał belkę, żeby dzwon się nie kołysał.",
                "Piekarz przyniósł kosz ciepłych owsianych bułeczek z miodem, bo robota miała potrwać do późnej nocy. Kto odkładał narzędzia, dostawał jedną, a jedną zniesiono na dół dla Koniczynki.",
                "Oliwia polerowała dzwon lnianą szmatką, aż zabłysło w nim światło latarni. Kiedy księżyc stanął nad wieżą, na brzegu dzwonu lśniły trzy nity, jeden obok drugiego."
              ],
              "thank-bell": [
                "Wszyscy po kolei podsuwali babci imiona: Grzmot, Brzęczka, Bimbała… Babcia tylko kręciła głową. Wreszcie piekarz zawołał: „Wieczornica! Przecież co wieczór nas woła!”. Babci zabłysły oczy. Przypomniała sobie rymowankę.",
                "„Gdy Wieczornica zachrypi, nie płacz, nie narzekaj: obróć ją ku górom i na jej głos czekaj”. Cieśla zrozumiał pierwszy. „Jak ją obrócimy, serce będzie biło w zdrowy spiż, a pęknięcie zostanie z boku”.",
                "Gustaw z cieślą poluzowali uchwyty i obrócili Wieczornicę ku górom. Piekarz przyniósł kosz ciepłych owsianych bułeczek z miodem, żeby nikt nie pracował o pustym brzuchu. Jedną zniesiono na dół dla Koniczynki."
              ]
            }
          },
          curiosityNoteByChoice: {
            5: {
              "invite-smith": {
                title: "Czy wiesz, że...?",
                body: "Spiż na dzwony to mniej więcej cztery części miedzi i jedna część cyny. Więcej cyny daje jaśniejszy głos, ale metal robi się kruchy. Dlatego nawet wielki dzwon może pęknąć."
              },
              "thank-bell": {
                title: "Czy wiesz, że...?",
                body: "Dawne dzwony dostawały imiona, jak ludzie. A gdy serce dzwonu długo uderzało w jedno miejsce, obracano cały dzwon o ćwierć obrotu, żeby serce biło w zdrowy spiż. Tak robi się do dziś."
              }
            }
          },
        },
        {
          title: "Jak powitać nowy głos",
          body: [
            "Wreszcie dzwon był gotowy. Z nitami miał brzmieć odrobinę ciszej niż dawniej, ale kowalka się uśmiechnęła: „Ciszej, ale Maciej i tak go usłyszy”.",
            "Cała wioska czekała na placu. Księżyc wyjrzał zza chmury, a w gruszy obudziły się pisklęta i wychyliły główki z gniazda. Zięba siedziała przy nich i też patrzyła na wieżę.",
            "Piekarz stanął w drzwiach wieży z liną w rękach i spojrzał na Oliwię. „Jak go przywitamy?” – zapytał."
          ],
          paragraphByChoice: {
            5: {
              "invite-smith": {
                0: "Wreszcie dzwon był gotowy. Z nitami miał brzmieć odrobinę ciszej niż dawniej, ale kowalka się uśmiechnęła: „Ciszej, ale Maciej i tak go usłyszy”."
              },
              "thank-bell": {
                0: "Wreszcie Wieczornica wisiała obrócona ku górom. Babcia Janina poklepała ją po spiżu. „No, stara, pokaż, że rymowanka nie kłamała”."
              }
            }
          },
          choices: [
            {
              label: "Zadzwoń delikatnie",
              response: "Piekarz pociągnie linę lekko, żeby dzwon odezwał się łagodnie."
            },
            {
              label: "Zanućcie razem z dzwonem",
              response: "Wszyscy na placu zanucą razem z dzwonem jego wieczorną nutę."
            }
          ],
        },
        {
          title: "Dzwon znów woła",
          bodyByChoice: {
            7: {
              "ring-gently": [
                "Piekarz pociągnął linę lekko, ledwie-ledwie. Dzwon odezwał się jasno i czysto, a dzieci zawołały razem z nim: „Bim-bam, do domu!”. Głos popłynął od okna do okna i dalej, aż pod góry.",
                "Po chwili z ciemności odpowiedziały mu dzwoneczki kóz. Pasterz Maciej schodził we mgle prosto na głos dzwonu, a wójt odetchnął z ulgą.",
                "Dzwonu słuchali rodzice i dzieci, starsi, kowalka, cieśla i bardzo zadowolona Koniczynka, która miała na nosie biały ślad mąki po bułeczce."
              ],
              "share-song": [
                "Piekarz pociągnął linę. Cały plac zanucił razem z dzwonem, a potem zaśpiewał: „Bim-bam, do domu!”. Nie dało się rozróżnić, gdzie kończy się spiż, a gdzie zaczynają się głosy.",
                "W gruszy pisklęta podniosły główki i słuchały tak uważnie, jakby chciały zapamiętać każdą nutę. A z ciemności odpowiedziały dzwoneczki kóz: pasterz Maciej schodził we mgle prosto na głos dzwonu.",
                "Dzwonu słuchali rodzice i dzieci, starsi, kowalka, cieśla i bardzo zadowolona Koniczynka, która miała na nosie biały ślad mąki po bułeczce."
              ]
            }
          },
          curiosityNoteByChoice: {
            7: {
              "ring-gently": {
                title: "Czy wiesz, że...?",
                body: "Dzwonem przekazywano różne wieści: szybkie bicie znaczyło niebezpieczeństwo, a powolne – smutek. W mgliste noce w górskich wsiach dzwoniono długo, żeby zabłąkani wędrowcy trafili do domu."
              },
              "share-song": {
                title: "Czy wiesz, że...?",
                body: "Młode zięby uczą się śpiewu, słuchając starszych ptaków. Dlatego zięby z różnych okolic śpiewają trochę inaczej, jakby każda dolina miała własną gwarę."
              }
            }
          },
        },
        {
          title: "Pamiątka tamtej nocy",
          body: [
            "Długo po tym, jak plac opustoszał, z sadu przyfrunęły trzy srebrne ćmy. Nic już nie czekało na naprawę, więc nie krążyły, tylko usiadły rzędem na dzwonie i połyskiwały w świetle księżyca jak małe gwiazdy. Od tamtej pory Księżycowe Wzgórze ma w herbie trzy gwiazdki.",
            "A kiedy na Wzgórzu coś się zepsuje, ludzie mówią: „Najpierw popatrz, dokąd patrzy koń”. A dzieci wiedzą, że chodzi o pewną cierpliwą klacz z czerwoną derką.",
            "Koniec."
          ],
          paragraphByChoice: {
            7: {
              "ring-gently": {
                0: "Długo po tym, jak plac opustoszał, z sadu przyfrunęły trzy srebrne ćmy. Nic już nie czekało na naprawę, więc nie krążyły, tylko usiadły rzędem na dzwonie i połyskiwały w świetle księżyca jak małe gwiazdy. Od tamtej pory Księżycowe Wzgórze ma w herbie trzy gwiazdki."
              },
              "share-song": {
                0: "Długo po tym, jak plac opustoszał, pisklęta przez sen powtarzały wieczorną melodię. Od tamtej pory dzwon woła wieczorem ludzi do domów, a zięby budzą wioskę o świcie tą samą piosenką. Księżycowe Wzgórze ma dwa głosy: jeden ze spiżu, drugi z piórek."
              }
            },
            1: {
              "follow-clover": {
                1: "A kiedy na Wzgórzu coś się zepsuje, ludzie mówią: „Najpierw popatrz, dokąd patrzy koń”. A dzieci wiedzą, że chodzi o pewną cierpliwą klacz z czerwoną derką."
              },
              "ask-elders": {
                1: "A kiedy na Wzgórzu coś się zepsuje, ludzie mówią: „Najpierw zapytaj najstarszych, bo oni pamiętają dawne wiatry”. A babcia Janina zawsze wtedy kiwa głową."
              }
            }
          },
        }
      ]
    }
  }
};
