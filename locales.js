export const uiText = {
  en: {
    languageLabel: "Choose language",
    pageCount: (page, total) => `Page ${page} of ${total}`,
    savedPage: (page) => `p. ${page}`,
    choiceHint: "Choose a kind action, then turn the page to see what changes.",
    curiosityNote: "Did you know...?",
    restartStory: "Begin again",
    soundLabel: "Sound",
    quietLabel: "Quiet",
    soundOn: "Sound on",
    soundOff: "Sound off"
  },
  pl: {
    languageLabel: "Wybierz język",
    pageCount: (page, total) => `Strona ${page} z ${total}`,
    savedPage: (page) => `s. ${page}`,
    choiceHint: "Wybierz dobry gest, a potem przewróć stronę, by zobaczyć, co się zmieni.",
    curiosityNote: "Czy wiesz, że...?",
    restartStory: "Zacznij od nowa",
    soundLabel: "Dźwięk",
    quietLabel: "Cisza",
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
            "Pod wieczór rycerz Gustaw i mała Oliwia stanęli przed starym mostem, takim, po którym od dawien dawna chodziły konie z jukami, młynarze z workami i dzieci niosące mleko do wioski.",
            "Między kamieniami rósł mech miękki jak zielony pled, pod łukami szemrał potok, a na samym środku, ku ich zdziwieniu, siedział nieduży smok, cały miedziany. Co więcej, wyglądał na zmartwionego.",
            "Nie ryczał. Nie straszył. Tylko trzymał łapy pod brodą, a ogonem otulał jeden obluzowany kamień, jakby pilnował czegoś bardzo kruchego."
          ],
          curiosityNote: {
            title: "Czy wiesz, że...?",
            body: "Dawne kamienne mosty często budowano z wielu klinowatych kamieni. Środkowy kamień pomagał łukowi trzymać kształt, trochę jak cichy strażnik drogi."
          },
        },
        {
          title: "Cichy głos spod mostu",
          body: [
            "Smok wypuścił z nozdrzy dymek tak mały, że zmieściłby się w kubku na mleko. Dymek był złoty po brzegach i unosił się na wietrze, opadając pod most, bardzo powoli.",
            "Wtedy spod kamieni dobiegło ciche: pi, pi, pi. Szum potoku prawie przykrył ten głos, a wiatr poruszył trzcinami, jakby też chciał usłyszeć więcej.",
            "Gustaw nie zrobił ani kroku. Oparł tarczę o kolano, wziął spokojny oddech, a Oliwia zrobiła to samo, przyglądając się uważnie smokowi."
          ],
          choices: [
            {
              label: "Zapytaj, co się stało",
              response: "Łagodne pytanie daje smokowi odwagę, żeby wskazał, czego pilnuje."
            },
            {
              label: "Poczekaj i posłuchaj",
              response: "Cisza pomaga Oliwii usłyszeć najmniejsze piśnięcie pod mostem."
            }
          ],
        },
        {
          title: "Kamień z sekretem",
          body: [
            "Oliwia uklękła przy krawędzi mostu i zobaczyła gniazdko rzecznych myszek, wciśnięte między mech, wapno i korzonki trawy.",
            "Najmniejsza myszka schowała się za kamieniem ogrzanym smoczym oddechem. Smok bał się, że stukot butów zatrzęsie mostem i wypłoszy całą maleńką rodzinę.",
            "Droga nie była zamknięta przez kaprys. Most po prostu skrywał sekret, a smok pilnował tych, którzy byli zbyt mali, by samodzielnie zawołać po pomoc."
          ],
          echoes: {
            1: {
              ask: "Dzięki temu pytaniu księga pokazała odpowiedź smoka.",
              listen: "Dzięki temu słuchaniu księga podążyła za najcichszym głosem."
            }
          },
          paragraphByChoice: {
            1: {
              ask: {
                0: "Kiedy Oliwia zapytała, co się stało, smok stuknął pazurem w obluzowany kamień i pochylił głowę ku szczelinie pod mostem.",
                1: "Tam zobaczyła gniazdko rzecznych myszek, wciśnięte między mech, wapno i korzonki trawy. Najmniejsza myszka schowała się za kamieniem ogrzanym smoczym oddechem."
              },
              listen: {
                0: "Oliwia została w ciszy tak długo, aż najcichsze piśnięcie odezwało się ponownie. Dochodziło z brzegu mostu, gdzie mech przykrywał wąską szczelinę.",
                1: "W środku było gniazdko rzecznych myszek, wciśnięte między wapno i korzonki trawy. Najmniejsza myszka drżała za kamieniem ogrzanym smoczym oddechem."
              }
            }
          },
        },
        {
          title: "Plan dla małych myszek",
          body: [
            "Wieczór stawał się chłodniejszy, a mgła podnosiła się znad potoku jak biała wstążka. W omszałej szczelinie myszki trzęsły wąsikami.",
            "Gustaw trzymał latarnię, Oliwia pół żytniego bochenka w lnianym płótnie, a smok wypuszczał ciepły oddech, którego używał delikatniej niż świecy.",
            "Trzeba było zacząć od gestu małego i spokojnego: takiego, który nie spłoszy myszek i pokaże smokowi, że może zaufać naszym bohaterom."
          ],
          choices: [
            {
              label: "Unieś latarnię",
              response: "Światło latarni pokaże, gdzie można bezpiecznie podać pomocną dłoń."
            },
            {
              label: "Podziel się chlebem",
              response: "Zapach chleba doda myszkom odwagi, żeby podejść bliżej."
            }
          ],
        },
        {
          title: "Pomoc nadchodzi z młyna",
          body: [
            "Gustaw zatknął czerwony proporzec przy ścieżce do młyna. Materiał poruszył się na wietrze, dając jednocześnie znak ludziom z wioski, że coś ważnego się dzieje na moście.",
            "Dzięki inicjatywie Gustawa, zaraz nadszedł młynarz z owczą wełną, piekarka z czystą chustą i wikliniarz z naręczem trzcin pachnących deszczem. Każdy niósł coś innego.",
            "Nikt nie śmiał się, że sprawa jest maleńka czy niepoważna. Wioska, która umie troszczyć się o małe stworzenia, uczy się troszczyć także o wielkie sprawy."
          ],
          echoes: {
            3: {
              lantern: "Dzięki uniesionej latarni pomocnicy zobaczyli bezpieczne miejsca do pracy.",
              bread: "Dzięki podzielonemu chlebowi myszki odważyły się podejść bliżej."
            }
          },
          paragraphByChoice: {
            3: {
              lantern: {
                0: "Gustaw zatknął czerwony proporzec przy ścieżce do młyna, a uniesiona latarnia pokazała najbezpieczniejsze kamienie pod mchem. Materiał poruszył się na wietrze i dał znak wiosce.",
                1: "Dzięki jasnemu światłu zaraz nadszedł młynarz z owczą wełną, piekarka z czystą chustą i wikliniarz z naręczem trzcin pachnących deszczem. Każdy wiedział, gdzie ostrożnie postawić stopę."
              },
              bread: {
                0: "Gustaw zatknął czerwony proporzec przy ścieżce do młyna, a przy omszałej szczelinie czekały okruszki ciepłego chleba. Materiał poruszył się na wietrze i dał znak wiosce.",
                1: "Zwabione zapachem myszki wysunęły noski, gdy nadszedł młynarz z owczą wełną, piekarka z czystą chustą i wikliniarz z naręczem trzcin pachnących deszczem."
              }
            }
          },
          curiosityNote: {
            title: "Czy wiesz, że...?",
            body: "Wiele dawnych młynów stawiano nad strumieniami, bo płynąca woda mogła obracać wielkie koło. To koło pomagało mielić ziarno na mąkę dla całej wioski."
          },
        },
        {
          title: "Kołyska z trzciny i mchu",
          body: [
            "Wikliniarz uplótł kołyskę z trzcin, wełny i suchego mchu. Była okrągła jak łupinka orzecha i lekka jak wiosenny liść.",
            "Smok pochylił pysk i ogrzał ją jednym malutkim oddechem. Myszki mrugały, ich wąsiki drżały, ale żadna nie uciekła.",
            "Teraz trzeba było przenieść gniazdko z kamienia do koszyka. Przy takim zadaniu ręce musiały być ostrożne, a serca jeszcze spokojniejsze."
          ],
          choices: [
            {
              label: "Poproś wikliniarza o pomoc",
              response: "Wikliniarz pokaże, jak ustawić kołyskę najdelikatniej."
            },
            {
              label: "Przenieście gniazdo razem",
              response: "Kilka ostrożnych rąk pomoże myszkom odbyć krótką podróż."
            }
          ],
          curiosityNote: {
            title: "Czy wiesz, że...?",
            body: "Trzciny to lekkie i giętkie rośliny rosnące przy wodzie. Od bardzo dawna ludzie wyplatali z nich kosze, maty, dachy i różne drobne rzeczy."
          },
        },
        {
          title: "Przeprowadzka maleńkich łapek",
          body: [
            "Pierwsza myszka weszła na wełnę. Za nią druga. Na końcu ruszyła najmniejsza, okrągła jak laskowy orzeszek, prowadzona ciepłym smoczym nosem.",
            "Oliwia trzymała dłonie otwarte i nieruchome. „Już dobrze” - szepnęła. Gustaw podsunął pod koszyk tarczę, żeby nikt nie spadł.",
            "Kiedy kołyska stanęła w suchej trawie, smok mrugnął powoli. Tak mostowe smoki mówią dziękuję, jeśli nie chcą nikogo obudzić ani spłoszyć."
          ],
          echoes: {
            5: {
              "basket-maker": "Dzięki pomocy wikliniarza kołyska ruszyła pod właściwym kątem.",
              "carry-together": "Dzięki wspólnemu przenoszeniu cały most zwolnił krok."
            }
          },
          paragraphByChoice: {
            5: {
              "basket-maker": {
                0: "Wikliniarz ustawił kołyskę przy kamieniu i przechylił ją tylko tak bardzo, jak liść ugina się pod kroplą deszczu. Pierwsza myszka weszła na wełnę. Za nią druga.",
                1: "Oliwia patrzyła na dłonie wikliniarza i trzymała swoje otwarte i nieruchome. Gustaw podsunął pod koszyk tarczę, żeby nikt nie spadł."
              },
              "carry-together": {
                0: "Pomocnicy otoczyli kołyskę, a każdy przytrzymał jej mały fragment. Pierwsza myszka weszła na wełnę. Za nią druga.",
                1: "Oliwia trzymała dłonie otwarte i nieruchome, a Gustaw podsunął pod nie tarczę. Wszyscy poruszali się w tempie najmniejszych łapek."
              }
            }
          },
        },
        {
          title: "Obietnica na starym moście",
          body: [
            "Gdy myszki były bezpieczne, smok odsunął się z drogi. Most znów stał otworem, ale nikt nie przebiegł przez niego w pośpiechu.",
            "Miecz Gustawa zalśnił w pochwie. Nie dlatego, że ktoś zwyciężył, tylko dlatego, że okazano pomoc komuś mniejszemu.",
            "Księga zaszeleściła kartką. Chciała wiedzieć, co wydarzy się dalej, zanim ścieżka poprowadzi bohaterów ku gospodzie pełnej świec."
          ],
          choices: [
            {
              label: "Wypowiedz słowa podzięki dla smoka",
              response: "Księga zapisze słowa podzięki w smoczym języku."
            },
            {
              label: "Pomachaj na dobranoc",
              response: "Smok odpowie jednym ciepłym, sennym mrugnięciem."
            }
          ],
        },
        {
          title: "Most znów jest otwarty",
          body: [
            "Mieszkańcy przechodzili przez most jeden po drugim. Każdy zerkał w dół, gdzie przy trzcinach stała nowa mysia kołyska.",
            "Smok położył się na ciepłym kamieniu. Wyglądał teraz na mniejszego niż wtedy, gdy wszyscy się go bali, ale cały czas czuwał w pobliżu.",
            "Oliwia zrozumiała, że zamknięta droga czasem jest pytaniem. A najlepsza odpowiedź nie polega na parciu do przodu, tylko najpierw słuchaniu i zrozumieniu."
          ],
          echoes: {
            7: {
              "name-promise": "Dzięki podziękowaniu smokowi księga zachowała jego słowa w złocie.",
              "wave-goodnight": "Dzięki pożegnaniu most stał się cichy i ciepły."
            }
          },
          paragraphByChoice: {
            7: {
              "name-promise": {
                0: "Mieszkańcy przechodzili przez most jeden po drugim, zatrzymując się przy złotych słowach, które księga zapisała w smoczym języku.",
                1: "Smok położył się na ciepłym kamieniu obok liter. Wyglądał teraz na mniejszego niż wtedy, gdy wszyscy się go bali, ale cały czas czuwał w pobliżu."
              },
              "wave-goodnight": {
                0: "Mieszkańcy przechodzili przez most jeden po drugim, zatrzymując się przy trzech nowych kwiatach ogrzanych sennym smoczym oddechem.",
                1: "Smok położył się na ciepłym kamieniu z jednym okiem przymkniętym. Wyglądał teraz na mniejszego niż wtedy, gdy wszyscy się go bali, ale cały czas czuwał w pobliżu."
              }
            }
          },
        },
        {
          title: "To, co zapamiętała księga",
          body: [
            "Długo po tym, jak świece przygasły, most wciąż symbolizował to, co tam było: smoka, trzcinową kołyskę i rzeczne myszki śpiące bezpiecznie przy brzegu.",
            "Na ostatniej stronie księga zapisała cicho: siła może osłaniać, odwaga może słuchać, a życzliwość potrafi otworzyć nawet najstarszą drogę.",
            "Koniec."
          ],
          echoes: {
            7: {
              "name-promise": "Księga zapamiętała wypowiedziane podziękowanie.",
              "wave-goodnight": "Księga zapamiętała ciche pożegnanie."
            }
          },
          paragraphByChoice: {
            7: {
              "name-promise": {
                0: "Długo po tym, jak świece przygasły, most wciąż symbolizował to, co tam było: smoka, złote słowa podziękowania i rzeczne myszki śpiące bezpiecznie przy brzegu.",
                1: "Na ostatniej stronie księga zapisała cicho: siła może osłaniać, odwaga może słuchać, a wdzięczność potrafi sprawić, że stara droga wydaje się nowa."
              },
              "wave-goodnight": {
                0: "Długo po tym, jak świece przygasły, most wciąż symbolizował to, co tam było: smoka, trzy ciepłe kwiaty i rzeczne myszki śpiące bezpiecznie przy brzegu.",
                1: "Na ostatniej stronie księga zapisała cicho: siła może osłaniać, odwaga może słuchać, a łagodne pożegnanie potrafi zostawić drogę w spokoju."
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
            "Na Księżycowym Wzgórzu wieczorny dzwon zawsze wołał ludzi do domów, gdy z kominów płynął niebieskawy dym, a kury szukały grzęd w zagrodach.",
            "Tego wieczoru dzwonnica jednak milczała. Na placu stanęły rodziny w wełnianych chustach, z rogowymi latarniami, i kierowały wzrok i słuch w miejsce, z którego powinien wydobywać się dźwięk.",
            "Gustaw położył dłoń na tarczy, a Oliwia zauważyła, że Koniczynka, jego cierpliwa klacz, kieruje pysk w stronę ścieżki do starego sadu, gdzie ćmy błyszczały jak srebrne listki."
          ],
          curiosityNote: {
            title: "Czy wiesz, że...?",
            body: "Zanim zegary stały się powszechne, wiejskie dzwony pomagały ludziom wiedzieć, kiedy się zebrać, pracować, odpocząć albo wracać do domu."
          },
        },
        {
          title: "Dwie drogi do zagadki",
          body: [
            "Wójt wspomniał o posiadanym kluczu do wieży. Piekarz spojrzał na linę od dzwonu. Dzieci zerkały ku sadom, bo Koniczynka wciąż patrzyła między grusze.",
            "Oliwia czuła w brzuchu małe zaniepokojenie, ale słuchała każdego. Wszyscy zaczęli się wspólnie zastanawiać, jak można zaradzić na brak dźwięku z dzwonnicy.",
            "Można było pójść za końskim nosem ku srebrnym ćmom. Można też było zapytać starszych z wioski, czy wiatr z gór może mieć coś z tym wspólnego."
          ],
          choices: [
            {
              label: "Idź za Koniczynką",
              response: "Koniczynka prowadzi wszystkich tam, gdzie migoczą srebrne ćmy."
            },
            {
              label: "Zapytaj starszych",
              response: "Starsi przypominają sobie dawny kaprys górskiego wiatru."
            }
          ],
        },
        {
          title: "Lina w gałęziach gruszy",
          body: [
            "Za wieżą lina od dzwonu wysunęła się przez otwartą okiennicę i po wietrznym popołudniu zaplątała wysoko między gałęziami starej gruszy.",
            "Tuż obok znajdowało się gniazdko zięb, schowane w liściach pachnących deszczem i owocami. Gdyby ktoś szarpnął za mocno, gniazdko mogłoby spaść z gałęzi.",
            "Dzwon nie popsuł się i nie obraził na wioskę. Czekał tylko na tych, którzy najpierw dobrze popatrzą, a dopiero potem zdecydują, jak mu pomóc."
          ],
          echoes: {
            1: {
              "follow-clover": "Dzięki Koniczynce księga zauważyła znaki w sadzie.",
              "ask-elders": "Dzięki rozmowie ze starszymi księga przypomniała sobie dawny wiatr."
            }
          },
          paragraphByChoice: {
            1: {
              "follow-clover": {
                0: "Koniczynka poprowadziła wszystkich za wieżę, prosto do gruszy, przy której srebrne ćmy krążyły wokół liny zaplątanej wysoko w gałęziach.",
                1: "Do liny przyczepiły się gruszkowe liście, a tuż obok spały małe zięby w gniazdku, schowanym w liściach pachnących deszczem i owocami. Gdyby ktoś szarpnął za mocno, gniazdko mogłoby spaść z gałęzi."
              },
              "ask-elders": {
                0: "Babcia Janina zaprowadziła wszystkich za wieżę i wskazała gruszę, która zginała się ku dzwonnicy zawsze, gdy z gór schodził mocniejszy wiatr.",
                1: "Tam właśnie lina zaplątała się wysoko między gałęziami, obok gniazdka zięb schowanego w liściach pachnących deszczem i owocami. Gdyby ktoś szarpnął za mocno, gniazdko mogłoby spaść z gałęzi."
              }
            }
          },
          curiosityNote: {
            title: "Czy wiesz, że...?",
            body: "Grusze potrafią żyć bardzo długo, a ich wiosenne kwiaty są lubiane przez pszczoły. W dawnych wioskach sad był i spiżarnią, i małym schronieniem dla ptaków."
          },
        },
        {
          title: "Cicho przy gnieździe",
          body: [
            "Cieśla przyniósł jesionową drabinę i postawił ją tak cicho, że nawet oparta o kamienie pod murem nie wydała żadnego dźwięku.",
            "Piekarka owinęła dolny szczebel płótnem, Oliwia patrzyła na puchate gniazdko, a Koniczynka stała bez ruchu, jakby nawet jej ogon potrafił zachować ciszę.",
            "Linę trzeba było odpowiednio wyciągnąć. Tylko jak być mocnym, a jednocześnie delikatnym, mając tuż obok śpiące ptaki?"
          ],
          choices: [
            {
              label: "Wyciągnijcie ją powoli",
              response: "Powolne ruchy pozwolą ziębom spać dalej."
            },
            {
              label: "Trzymajcie pewnie drabinę",
              response: "Pewnie trzymana drabina pomoże działać spokojnie."
            }
          ],
        },
        {
          title: "Uwolniona lina",
          body: [
            "Pętla po pętli lina robiła się luźniejsza. Jeden gruszkowy liść spadł Oliwii na rękaw, wskazując jej właściwy kierunek, który obrała.",
            "Kiedy ostatni supeł puścił, wszyscy uśmiechnęli się cichutko. Zięby spały dalej, wtulone pod skrzydłami ich matki.",
            "Lina znów zwisała z wieży, lecz gdy cieśla pociągnął ją lekko, zamiast dźwięku usłyszeli tylko suche stuk, jakby dzwon odchrząknął i zamilkł."
          ],
          echoes: {
            3: {
              "move-slowly": "Dzięki powolnym ruchom gniazdko pozostało ciche.",
              "steady-ladder": "Dzięki pewnie trzymanej drabinie lina zeszła bezpiecznie."
            }
          },
          paragraphByChoice: {
            3: {
              "move-slowly": {
                0: "Pętla po pętli lina robiła się luźniejsza, a każda dłoń poruszała się powoli jak kurz w świetle latarni. Jeden gruszkowy liść spadł Oliwii na rękaw.",
                1: "Kiedy ostatni supeł puścił, wszyscy uśmiechnęli się cichutko. Zięby spały dalej, wtulone pod skrzydłami ich matki."
              },
              "steady-ladder": {
                0: "Drabina stała pewnie pod butami cieśli, więc mógł dosięgnąć supła bez potrząsania gałęzią. Jeden gruszkowy liść spadł Oliwii na rękaw.",
                1: "Kiedy ostatni supeł puścił, cieśla opuścił linę obiema rękami. Zięby spały dalej, wtulone pod skrzydłami ich matki."
              }
            }
          },
        },
        {
          title: "Pęknięcie na dzwonie",
          body: [
            "W środku wieży, na brzegu spiżowego dzwonu, widać było pęknięcie cienkie jak włos. Trzeba było przysunąć latarnię bardzo blisko, żeby je zobaczyć.",
            "Cieśla dotknął dzwonu dwoma palcami i skinął głową. „Nie ma co się z tego powodu złościć. Dziś pomożemy mu odzyskać głos”.",
            "Ludzie z wioski połączyli swoje siły, wykorzystując to, że ktoś znał się na dzwonach, ktoś potrafił trzymać mocno drabinę, a ktoś po prostu umiał dodać otuchy, gdy to było potrzebne."
          ],
          choices: [
            {
              label: "Poproś kowalkę o pomoc",
              response: "Kowalka przyniesie drobny młotek i lśniące nity."
            },
            {
              label: "Zachęć ludzi, by okazali wdzięczność dzwonowi",
              response: "Dzwon zostanie potraktowany jak stary przyjaciel, nie jak zużyty przedmiot."
            }
          ],
          curiosityNote: {
            title: "Czy wiesz, że...?",
            body: "Wiele dawnych dzwonów odlewano ze spiżu, czyli brązu dzwonowego. To metal, który potrafi zabrzmieć ciepłym głosem i ponieść dźwięk daleko przez powietrze."
          },
        },
        {
          title: "Wioska naprawia dzwon",
          body: [
            "Przy świecach i świetle księżyca mieszkańcy wioski pracowali w kręgu. Kowalka stukała cicho, cieśla podtrzymywał belkę, a piekarz podawał owsiane bułeczki.",
            "Oliwia czyściła dzwon lnianą szmatką, aż odbiło się w nim błyszczące światło latarni. Na dole Koniczynka nasłuchiwała, czy pojawi się w końcu jakiś ton z góry.",
            "Milcząca wieża zmieniła się w warsztat, a warsztat wyglądał jak rodzina zebrana wokół czegoś, czego nikt nie chciał zostawić samego."
          ],
          echoes: {
            5: {
              "invite-smith": "Dzięki przyjściu kowalki wieża wypełniła się ostrożnym stukaniem.",
              "thank-bell": "Dzięki wdzięczności wszyscy pracowali w lepszych nastrojach."
            }
          },
          paragraphByChoice: {
            5: {
              "invite-smith": {
                0: "Przy świecach i świetle księżyca kowalka pracowała w kręgu z małym młotkiem i lśniącymi nitami. Cieśla podtrzymywał belkę, a piekarz podawał owsiane bułeczki.",
                1: "Oliwia czyściła dzwon lnianą szmatką między kolejnymi ostrożnymi stuknięciami, aż odbiło się w nim błyszczące światło latarni. Na dole Koniczynka nasłuchiwała, czy pojawi się w końcu jakiś ton z góry."
              },
              "thank-bell": {
                0: "Przy świecach i świetle księżyca mieszkańcy najpierw położyli dłonie blisko dzwonu i podziękowali mu za wszystkie wieczory, kiedy wołał ich do domów.",
                1: "Potem Oliwia czyściła dzwon lnianą szmatką, kowalka stukała cicho, a cieśla podtrzymywał belkę. Na dole Koniczynka nasłuchiwała, czy pojawi się w końcu jakiś ton z góry."
              }
            }
          },
        },
        {
          title: "Jak powitać nowy głos",
          body: [
            "Wreszcie dzwon był naprawiony. Nie będzie już brzmiał tak głośno jak dawniej, ale kowalka uśmiechnęła się: „Cichy głos też potrafi wołać do domu”.",
            "Księżyc zaświecił nad wieżą. W sadzie poruszyły się zięby, a dzieci na placu wstrzymały oddech, jakby cała wioska słuchała i cierpliwie czekała.",
            "Księga czekała na ostatni gest. Jak powitać nowy głos dzwonu, którego każdy potrzebował?"
          ],
          choices: [
            {
              label: "Zadzwoń delikatnie",
              response: "Wioska usłyszy dźwięk cichy, ale taki, jak trzeba."
            },
            {
              label: "Zanuć wraz ze dzwonem",
              response: "Do dźwięku dzwonu dołączą głosy sąsiadów."
            }
          ],
        },
        {
          title: "Dzwon brzmi inaczej",
          body: [
            "Dzwon odezwał się ciszej niż kiedyś, lecz jego głos był jasny i przyjemny. Nie popłynął przez całą dolinę, lecz i tak wypełnił wioskę od okna do okna.",
            "Słuchali go rodzice, dzieci, starsi, piekarz, kowalka, cieśla i bardzo dumna Koniczynka, która miała na nosie biały ślad mąki od zjedzonych bułęczek.",
            "Księżycowe Wzgórze zapamiętało, że wspólnota to nie tylko ci, którzy siadają razem do stołu. To także ci, którzy zostają, żeby ten stół naprawić."
          ],
          echoes: {
            7: {
              "ring-gently": "Dzięki delikatnemu dzwonieniu pierwsza nuta zabrzmiała wyjątkowo.",
              "share-song": "Dzięki wspólnemu nuceniu pierwsza nuta miała towarzystwo głosów dookoła."
            }
          },
          paragraphByChoice: {
            7: {
              "ring-gently": {
                0: "Dzwon odezwał się ciszej niż kiedyś, lecz jego głos był jasny i przyjemny. Delikatne pociągnięcie pozwoliło nucie przejść od domu do domu bez zbędnego hałasu.",
                1: "Słuchali go rodzice, dzieci, starsi, piekarz, kowalka, cieśla i bardzo dumna Koniczynka, która miała na nosie biały ślad mąki od zjedzonych bułeczek."
              },
              "share-song": {
                0: "Dzwon odezwał się ciszej niż kiedyś, a mieszkańcy nucili razem z nim, aż nuta brzmiała, jakby była połączeniem głosu i dzwonu.",
                1: "Słuchali go rodzice, dzieci, starsi, piekarz, kowalka, cieśla i bardzo dumna Koniczynka; nawet zięby w sadzie pozostały spokojne."
              }
            }
          },
        },
        {
          title: "Pieśń na dobranoc",
          body: [
            "Długo po kolacji dzwon odpoczywał w wieży nad wioską. Jego naprawiony brzeg połyskiwał słabo w świetle księżyca.",
            "Księżycowe Wzgórze zapamiętało, że to, co ciche, nie jest bez znaczenia. Czasem czeka tylko na pomocne dłonie, cierpliwych przyjaciół i łagodną pieśń, ku nowemu początkowi.",
            "Koniec."
          ],
          echoes: {
            7: {
              "ring-gently": "Księga zapamiętała delikatne dzwonienie.",
              "share-song": "Księga zapamiętała wspólną pieśń."
            }
          },
          paragraphByChoice: {
            7: {
              "ring-gently": {
                0: "Długo po kolacji dzwon odpoczywał w wieży nad wioską, a jedna jasna srebrna nuta zdawała się krążyć przy jego naprawionym brzegu.",
                1: "Księżycowe Wzgórze zapamiętało, że to, co ciche, nie jest bez znaczenia. Czasem czeka tylko na pomocne dłonie, cierpliwych przyjaciół i jedno ostrożne pociągnięcie ku nowemu początkowi."
              },
              "share-song": {
                0: "Długo po kolacji dzwon odpoczywał w wieży nad wioską, a melodia nuceniem podjęta przez sąsiadów zdawała się unosić na księżycowym niebie.",
                1: "Księżycowe Wzgórze zapamiętało, że to, co ciche, nie jest bez znaczenia. Czasem czeka tylko na pomocne dłonie, cierpliwych przyjaciół i łagodną pieśń, ku nowemu początkowi."
              }
            }
          },
        }
      ]
    }
  }
};
