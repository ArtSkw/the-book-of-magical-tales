export const uiText = {
  en: {
    languageLabel: "Choose language",
    pageCount: (page, total) => `Page ${page} of ${total}`,
    savedPage: (page) => `p. ${page}`,
    choiceHint: "Choose a kind action, then turn the page to see what changes.",
    parentNote: "Parent note",
    restartStory: "Begin again",
    virtue: "Virtue",
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
    parentNote: "Notatka dla rodzica",
    restartStory: "Zacznij od nowa",
    virtue: "Cnota",
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
          parentPrompt: "Po czym poznajesz, że smok może się czymś martwić?",
          virtue: "zachwyt"
        },
        {
          title: "Cichy głos spod mostu",
          body: [
            "Smok wypuścił z nozdrzy dymek tak mały, że zmieściłby się w kubku na mleko. Dymek był złoty po brzegach i unosił się na wietrze, opadając pod most, bardzo powoli.",
            "Wtedy spod kamieni dobiegło ciche: pi, pi, pi. Potok prawie przykrył ten głos, a wiatr poruszył trzcinami, jakby też chciał usłyszeć więcej.",
            "Gustaw nie zrobił ani kroku. Oparł tarczę o kolano, wziął spokojny oddech, a Oliwia zrobiła to samo, pokazując, że czasem odwaga zaczyna się od ciszy."
          ],
          choices: [
            {
              label: "Zapytaj, co się stało",
              response: "Łagodne pytanie daje smokowi odwagę, żeby pokazać, czego pilnuje."
            },
            {
              label: "Poczekaj i posłuchaj",
              response: "Cisza pomaga Oliwii usłyszeć najmniejsze piśnięcie pod mostem."
            }
          ],
          parentPrompt: "Dlaczego czasem dobrze jest najpierw posłuchać?",
          virtue: "cierpliwość"
        },
        {
          title: "Kamień z sekretem",
          body: [
            "Oliwia uklękła przy krawędzi mostu i zobaczyła gniazdko rzecznych myszek, wciśnięte między mech, wapno i korzonki trawy.",
            "Najmniejsza myszka schowała się za kamieniem ogrzanym smoczym oddechem. Smok bał się, że stukot butów zatrzęsie mostem i przestraszy całą maleńką rodzinę.",
            "Droga nie była zamknięta ze złości. Most po prostu skrywał sekret, a smok pilnował tych, którzy byli zbyt mali, by samodzielnie zawołać po pomoc."
          ],
          echoes: {
            1: {
              ask: "Po łagodnym pytaniu smok stuknął pazurem dwa razy w kamień i ostrożnie wskazał miejsce, gdzie trzeba było spojrzeć.",
              listen: "Dzięki cierpliwemu słuchaniu Oliwia odnalazła najcichsze piśnięcie, zanim ktokolwiek dotknął obluzowanego kamienia."
            }
          },
          parentPrompt: "Czy smok wygląda inaczej, kiedy wiemy już, czego pilnuje?",
          virtue: "życzliwość"
        },
        {
          title: "Plan dla małych myszek",
          body: [
            "Wieczór stawał się chłodniejszy, a mgła podnosiła się znad potoku jak biała wstążka. W omszałej szczelinie myszki trzęsły wąsikami.",
            "Gustaw trzymał latarnię, Oliwia pół żytniego bochenka w lnianym płótnie, a smok wypuszczał ciepły oddech, którego używał delikatniej niż świecy.",
            "Trzeba było zacząć od gestu małego i spokojnego: takiego, który nie spłoszy myszek i pokaże smokowi, że nie jest sam na moście."
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
          parentPrompt: "Co każdy z pomocników może dać od siebie?",
          virtue: "troska"
        },
        {
          title: "Pomoc nadchodzi z młyna",
          body: [
            "Gustaw zatknął czerwony proporzec przy ścieżce do młyna. Materiał poruszył się na wietrze, a koło wodne pluskało, jakby szepcząc: już idą, już idą.",
            "Przyszedł młynarz z owczą wełną, piekarka z czystą chustą i wikliniarz z naręczem trzcin pachnących deszczem. Każdy niósł coś innego.",
            "Nikt nie śmiał się, że sprawa jest maleńka czy niepoważna. Wioska, która umie troszczyć się o małe stworzenia, uczy się troszczyć także o wielkie sprawy."
          ],
          echoes: {
            3: {
              lantern: "Po wyborze latarni wszyscy zobaczyli, gdzie kamienie są luźne i gdzie można spokojnie oprzeć rękę.",
              bread: "Po wyborze chleba myszki wysunęły noski do okruszków, a Oliwia nuciła im cichutko, cichuteńko."
            }
          },
          parentPrompt: "Jaką pomoc zaoferowała każda osoba?",
          virtue: "przyjaźń"
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
              label: "Poproś wikliniarza bliżej",
              response: "Wikliniarz pokaże, jak ustawić kołyskę najdelikatniej."
            },
            {
              label: "Przenieście gniazdo razem",
              response: "Kilka ostrożnych rąk pomoże myszkom odbyć krótką podróż."
            }
          ],
          parentPrompt: "Po czym poznasz, że ktoś pomaga uważnie?",
          virtue: "cierpliwość"
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
              "basket-maker": "Wikliniarz podszedł bliżej i pokazał Oliwii, jak przechylić kołyskę, żeby nie wysunęła się ani jedna trzcina.",
              "carry-together": "Przy wspólnym przenoszeniu wszyscy zwolnili do tempa najmniejszej myszki."
            }
          },
          virtueByChoice: {
            5: {
              "basket-maker": "uważna życzliwość",
              "carry-together": "wspólna odwaga"
            }
          },
          parentPrompt: "Kto w tej scenie jest odważny po cichu?",
          virtue: "odwaga"
        },
        {
          title: "Obietnica na starym moście",
          body: [
            "Gdy myszki były bezpieczne, smok odsunął się z drogi. Most znów stał otworem, ale nikt nie przebiegł przez niego w pośpiechu.",
            "Miecz Gustawa zalśnił w pochwie. Nie dlatego, że ktoś zwyciężył, tylko dlatego, że dotrzymano obietnicy złożonej komuś mniejszemu.",
            "Księga zaszeleściła kartką. Chciała wiedzieć, jak zapamiętać tę chwilę, zanim ścieżka poprowadzi dalej ku gospodzie pełnej świec."
          ],
          choices: [
            {
              label: "Nazwij obietnicę",
              response: "Księga zapisze obietnicę cienką złotą kreską."
            },
            {
              label: "Pomachaj na dobranoc",
              response: "Smok odpowie jednym ciepłym, sennym mrugnięciem."
            }
          ],
          parentPrompt: "Jaką obietnicę można złożyć małym stworzeniom?",
          virtue: "wierność"
        },
        {
          title: "Most znów jest otwarty",
          body: [
            "Mieszkańcy przechodzili przez most jeden po drugim. Każdy zerkał w dół, gdzie przy trzcinach stała nowa mysia kołyska.",
            "Smok położył się na ciepłym kamieniu. Wyglądał teraz na mniejszego niż wtedy, gdy wszyscy się go bali, ale wcale nie mniej istotnego.",
            "Oliwia zrozumiała, że zamknięta droga czasem jest pytaniem. A najlepsza odpowiedź nie polega na pchaniu się naprzód, tylko najpierw słuchaniu i zrozumieniu."
          ],
          echoes: {
            7: {
              "name-promise": "Po nazwaniu obietnicy tuż obok mostu, na ziemi pojawiły się złote słowa: każde małe życie na drodze ma znaczenie.",
              "wave-goodnight": "Po pożegnaniu smok mrugnął jeszcze raz i ogrzał trzy senne kwiaty przy ścieżce."
            }
          },
          parentPrompt: "Co się zmieniło, gdy wszyscy zrozumieli, o co chodziło smokowi?",
          virtue: "mądrość"
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
              "name-promise": "Po nazwaniu obietnicy ostatnia strona zachowała złote słowa przy śpiącym potoku.",
              "wave-goodnight": "Po pożegnaniu ostatnia strona zapamiętała smocze mrugnięcie jak małą gwiazdę."
            }
          },
          parentPrompt: "Który wybór z tej opowieści warto zapamiętać?",
          virtue: "łagodność"
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
          parentPrompt: "Co pomaga zachować spokój, kiedy coś dzieje się inaczej niż zwykle?",
          virtue: "zachwyt"
        },
        {
          title: "Dwie drogi do zagadki",
          body: [
            "Wójt wspomniał o posiadanym kluczu do wieży. Piekarz spojrzał na linę od dzwonu. Dzieci zerkały ku sadom, bo Koniczynka wciąż patrzyła między grusze.",
            "Oliwia czuła w brzuchu małe zaniepokojenie, ale słuchała każdego. Tajemnica robi się mniejsza, gdy każdy pomysł może zostać wspólnie omówiony.",
            "Można było pójść za końskim nosem ku srebrnym ćmom. Można też było zapytać starszych z wioski, czy wiatr z gór już kiedyś płatał podobne figle."
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
          parentPrompt: "Którego pomysłu warto posłuchać najpierw?",
          virtue: "szacunek"
        },
        {
          title: "Lina w gałęziach gruszy",
          body: [
            "Za wieżą lina od dzwonu wysunęła się przez otwartą okiennicę i po wietrznym popołudniu zaplątała wysoko między gałęziami starej gruszy.",
            "Tuż obok znajdowało się gniazdko zięb, schowane w liściach pachnących deszczem i owocami. Gdyby ktoś szarpnął za mocno, gałąź zatrzęsłaby się jak trzcina na wietrze.",
            "Dzwon nie popsuł się i nie obraził na wioskę. Czekał tylko na takich pomocników, którzy najpierw dobrze popatrzą, a dopiero potem zdecydują, co zrobić."
          ],
          echoes: {
            1: {
              "follow-clover": "Po drodze za Koniczynką wszyscy zobaczyli gruszkowe liście zaczepione o linę, zanim zaczęło się ściemniać.",
              "ask-elders": "Po rozmowie ze starszymi babcia Janina przypomniała sobie gałąź, która zgina się ku wieży zawsze, gdy wieje górski wiatr."
            }
          },
          parentPrompt: "Czy problem wydaje się inny, kiedy go lepiej rozumiemy?",
          virtue: "cierpliwość"
        },
        {
          title: "Cicho przy gnieździe",
          body: [
            "Cieśla przyniósł jesionową drabinę i postawił ją tak cicho, że nawet oparta o kamienie pod murem nie wydała żadnego dźwięku.",
            "Piekarka owinęła dolny szczebel płótnem, Oliwia patrzyła na puchate gniazdko, a Koniczynka stała bez ruchu, jakby nawet jej ogon potrafił zachować ciszę.",
            "Linę trzeba było wyciągnąć. Tylko jak być mocnym, a jednocześnie delikatnym, mając tuż obok śpiące ptaki?"
          ],
          choices: [
            {
              label: "Ruszajcie się powoli",
              response: "Powolne ruchy pozwolą ziębom spać dalej."
            },
            {
              label: "Trzymaj drabinę pewnie",
              response: "Pewnie trzymana drabina pomoże działać spokojnie."
            }
          ],
          parentPrompt: "Kiedy cierpliwość może być cnotą?",
          virtue: "troska"
        },
        {
          title: "Uwolniona lina",
          body: [
            "Pętla po pętli lina robiła się luźniejsza. Jeden gruszkowy liść spadł Oliwii na rękaw, więc wsunęła go między strony księgi jak ważny znak.",
            "Kiedy ostatni supeł puścił, wszyscy uśmiechnęli się cichutko. Zięby spały dalej, wtulone pod skrzydłami ich matki.",
            "Lina znów zwisała z wieży, lecz gdy cieśla pociągnął ją lekko, zamiast dźwięku usłyszeli tylko suche stuk, jakby dzwon odchrząknął i zamilkł."
          ],
          echoes: {
            3: {
              "move-slowly": "Dzięki powolnym ruchom zięby nie obudziły się, gdy Oliwia rozplątywała ostatnią pętlę.",
              "steady-ladder": "Dzięki pewnie trzymanej drabinie cieśla dosięgnął supła i opuścił linę obiema rękami."
            }
          },
          parentPrompt: "Co pomogło ochronić śpiące ptaki?",
          virtue: "delikatność"
        },
        {
          title: "Pęknięcie na dzwonie",
          body: [
            "W środku wieży, na brzegu spiżowego dzwonu, widać było pęknięcie cienkie jak włos. Trzeba było przysunąć latarnię bardzo blisko, żeby je zobaczyć.",
            "Cieśla dotknął dzwonu dwoma palcami i skinął głową. „Dziś nie będziemy się z tego powodu złościć. Dziś pomożemy mu odzyskać głos”.",
            "Ktoś znał się na dzwonach, ktoś umiał śpiewać, ktoś potrafił trzymać mocno drabinę, a ktoś po prostu umiał dodać otuchy, gdy to było potrzebne."
          ],
          choices: [
            {
              label: "Zaproś kowalkę",
              response: "Kowalka przyniesie drobny młotek i lśniące nity."
            },
            {
              label: "Podziękuj cichemu dzwonowi",
              response: "Dzwon zostanie potraktowany jak stary przyjaciel, nie jak zużyty przedmiot."
            }
          ],
          parentPrompt: "Czym różni się szukanie problemu od szukania rozwiązania?",
          virtue: "serdeczność"
        },
        {
          title: "Wioska naprawia dzwon",
          body: [
            "Przy świecach i świetle księżyca mieszkańcy wioski pracowali w kręgu. Kowalka stukała cicho, cieśla podtrzymywał belkę, a piekarka podawała owsiane bułeczki.",
            "Oliwia polerowała dzwon lnianą szmatką, aż odbiło się w nim błyszczące światło latarni. Na dole Koniczynka nasłuchiwała, czy pojawi się w końcu jakiś ton z góry.",
            "Milcząca wieża zmieniła się w warsztat, a warsztat wyglądał jak rodzina zebrana wokół czegoś, czego nikt nie chciał zostawić samego."
          ],
          echoes: {
            5: {
              "invite-smith": "Po zaproszeniu kowalki jej mały młotek wybijał spokojny rytm pod drewnianymi belkami.",
              "thank-bell": "Po podziękowaniu dzwonowi wszyscy pracowali tak, jakby pomagali staremu przyjacielowi odzyskać głos."
            }
          },
          virtueByChoice: {
            5: {
              "invite-smith": "współpraca",
              "thank-bell": "wdzięczność"
            }
          },
          parentPrompt: "Na ile sposobów można tutaj pomagać?",
          virtue: "wspólnota"
        },
        {
          title: "Jak powitać nowy głos",
          body: [
            "Wreszcie dzwon był naprawiony. Nie miał już brzmieć tak głośno jak dawniej, ale kowalka uśmiechnęła się: „Cichy głos też potrafi wołać do domu”.",
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
          parentPrompt: "Czy coś może być inne niż dawniej i nadal piękne?",
          virtue: "odwaga"
        },
        {
          title: "Dzwon brzmi inaczej",
          body: [
            "Dzwon odezwał się ciszej niż kiedyś, lecz jego głos był jasny i przyjemny. Nie popłynął przez całą dolinę, lecz i tak wypełnił wioskę od okna do okna.",
            "Słuchali go rodzice, dzieci, starsi, piekarz, kowalka, cieśla i bardzo dumna Koniczynka, która miała na nosie biały ślad mąki.",
            "Księżycowe Wzgórze zapamiętało, że wspólnota to nie tylko ci, którzy siadają razem do stołu. To także ci, którzy zostają, żeby ten stół naprawić."
          ],
          echoes: {
            7: {
              "ring-gently": "Po delikatnym dzwonieniu pierwsza nuta przeszła nad dachami jak świeca podawana od okna do okna.",
              "share-song": "Po wspólnym nuceniu pierwsza nuta wypełniła się wieloma głosami, na tyle cichymi, by nie spłoszyć zięb."
            }
          },
          virtueByChoice: {
            7: {
              "ring-gently": "czuła odwaga",
              "share-song": "przynależność"
            }
          },
          parentPrompt: "Czego można się nauczyć, kiedy wszyscy słuchają razem?",
          virtue: "pokój"
        },
        {
          title: "Pieśń na dobranoc",
          body: [
            "Długo po kolacji dzwon odpoczywał w wieży nad wioską. Jego naprawiony brzeg połyskiwał słabo w świetle księżyca.",
            "Księżycowe Wzgórze zapamiętało, że to, co ciche, nie jest bez znaczenia. Czasem czeka tylko na uważne dłonie, cierpliwych przyjaciół i łagodną pieśń, ku nowemu początkowi.",
            "Koniec."
          ],
          echoes: {
            7: {
              "ring-gently": "Po delikatnym dzwonieniu ostatnia strona zachowała jedną srebrną nutę nad dachami, jak magiczny symbol słuchania.",
              "share-song": "Po wspólnej pieśni ostatnia strona zapamiętała wioskę jako chór dobrych sąsiadów."
            }
          },
          virtueByChoice: {
            7: {
              "ring-gently": "łagodność",
              "share-song": "wdzięczność"
            }
          },
          parentPrompt: "Któremu pomocnikowi warto podziękować najpierw?",
          virtue: "wdzięczność"
        }
      ]
    }
  }
};
