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
            "Pod wieczór rycerz Gustaw i mała Oliwia doszli do starego kamiennego mostu. Od niepamiętnych czasów chodziły po nim konie objuczone sakwami, młynarze z workami mąki i dzieci, które niosły mleko do wioski.",
            "Między kamieniami rósł mech, miękki jak zielona derka, a pod jedynym łukiem szemrał potok. Na samym środku mostu siedział miedziany smok. Jak na smoka był nieduży, mniej więcej wielkości konia. Wcale nie wyglądał groźnie. Wyglądał na zmartwionego.",
            "Nie ryczał i nikogo nie straszył. Siedział prosto, z przednimi łapami opartymi o murek, a ogonem otulał jeden obluzowany kamień, jakby strzegł czegoś bardzo kruchego."
          ],
        },
        {
          title: "Mała niespodzianka",
          body: [
            "Smok westchnął i wypuścił z nozdrzy obłoczek tak mały, że zmieściłby się w kubku na mleko. Obłoczek miał złote brzegi i opadał na obluzowany kamień powoli, bardzo powoli.",
            "Wtedy spod kamieni dobiegło cichutkie: pi, pi, pi. Potok szumiał tak, że prawie je zagłuszył, a trzciny pochyliły się na wietrze, jakby też chciały posłuchać.",
            "Gustaw nie zrobił ani kroku. Oparł tarczę o kolano i odetchnął spokojnie. Oliwia odetchnęła razem z nim i nie spuszczała ze smoka oczu."
          ],
          choices: [
            {
              label: "Zapytaj, co się stało",
              response: "Łagodne pytanie doda smokowi odwagi, żeby pokazał, czego pilnuje."
            },
            {
              label: "Poczekaj i posłuchaj",
              response: "W ciszy Oliwia usłyszy najcichsze piśnięcie spod kamienia."
            }
          ],
        },
        {
          title: "Kamień z sekretem",
          body: [
            "Oliwia uklękła przy krawędzi mostu i zobaczyła gniazdko rzecznych myszek, wciśnięte między mech, wapno i korzonki trawy.",
            "Najmniejsza myszka schowała się za kamieniem ogrzanym smoczym oddechem. Smok bał się, że każdy krok na moście wypłoszy maleńką rodzinę z kryjówki.",
            "Smok nie zamknął drogi dla kaprysu. Obluzowany kamień chybotał się pod każdym krokiem, a razem z nim drżało gniazdko. Ktoś musiał pilnować tych, którzy są za mali, żeby sami zawołać o pomoc."
          ],
          echoes: {
            1: {
              ask: "Oliwia zapytała łagodnie, więc smok jej odpowiedział.",
              listen: "Oliwia słuchała tak cicho, że księga usłyszała najcichszy głos."
            }
          },
          paragraphByChoice: {
            1: {
              ask: {
                0: "Kiedy Oliwia łagodnie zapytała, co się stało, smok stuknął pazurem w obluzowany kamień i ostrożnie uchylił jego brzeg.",
                1: "Pod spodem Oliwia zobaczyła gniazdko rzecznych myszek, wciśnięte między mech, wapno i korzonki trawy. Najmniejsza myszka schowała się za kamieniem ogrzanym smoczym oddechem."
              },
              listen: {
                0: "Oliwia czekała w ciszy tak długo, aż piśnięcie odezwało się znowu. Dochodziło z brzegu mostu, gdzie mech przykrywał wąską szczelinę między kamieniami.",
                1: "W środku było gniazdko rzecznych myszek, wciśnięte między wapno i korzonki trawy. Najmniejsza myszka drżała za kamieniem ogrzanym smoczym oddechem."
              }
            }
          },
        },
        {
          title: "Pierwszy mały gest",
          body: [
            "Wieczór robił się chłodny, a znad potoku podnosiła się mgła, biała jak wstążka. W omszałej szczelinie myszki drżały i ruszały wąsikami.",
            "Gustaw trzymał latarnię, Oliwia pół bochenka żytniego chleba zawiniętego w lniane płótno, a smok chuchał ciepłem tak delikatnie, że nie zgasiłby nawet świecy.",
            "Trzeba było zacząć od czegoś małego i spokojnego. Od gestu, który nie spłoszy myszek, a smokowi pokaże, że może zaufać wędrowcom."
          ],
          choices: [
            {
              label: "Unieś latarnię",
              response: "Światło latarni pokaże, gdzie można bezpiecznie sięgnąć ręką."
            },
            {
              label: "Podziel się chlebem",
              response: "Zapach chleba doda myszkom odwagi."
            }
          ],
        },
        {
          title: "Czerwony proporzec",
          body: [
            "Gustaw zatknął czerwony proporzec przy ścieżce do młyna. Proporzec załopotał na wietrze i ludzie we wsi zobaczyli, że na moście dzieje się coś ważnego.",
            "Wkrótce nadszedł młynarz z naręczem owczej wełny, piekarka z czystą chustą i wikliniarz z pękiem trzcin pachnących deszczem. Każde z nich niosło coś innego.",
            "Nikt się nie śmiał, że to taka mała sprawa."
          ],
          echoes: {
            3: {
              lantern: "Gustaw uniósł latarnię wysoko, więc pomocnicy widzieli, gdzie bezpiecznie stanąć.",
              bread: "Oliwia podzieliła się chlebem, więc myszki odważyły się wyjrzeć."
            }
          },
          paragraphByChoice: {
            3: {
              lantern: {
                0: "Gustaw zatknął czerwony proporzec przy ścieżce do młyna i wysoko uniósł latarnię. Jej światło pokazało najpewniejsze kamienie pod mchem, a proporzec dał znak ludziom we wsi.",
                1: "Wkrótce nadszedł młynarz z naręczem owczej wełny, piekarka z czystą chustą i wikliniarz z pękiem trzcin pachnących deszczem. W jasnym świetle każde wiedziało, gdzie ostrożnie postawić stopę."
              },
              bread: {
                0: "Gustaw zatknął czerwony proporzec przy ścieżce do młyna, a przy omszałej szczelinie czekały okruszki chleba. Proporzec załopotał i dał znak ludziom we wsi.",
                1: "Myszki poczuły zapach chleba i wysunęły noski akurat wtedy, gdy nadchodzili młynarz z owczą wełną, piekarka z czystą chustą i wikliniarz z trzcinami pachnącymi deszczem."
              }
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
            "Wikliniarz uplótł kołyskę z trzcin, wełny i suchego mchu, a piekarka wyścieliła ją swoją czystą chustą. Kołyska wyszła okrągła jak łupinka orzecha i lekka jak wiosenny liść.",
            "Smok pochylił pysk i ogrzał ją jednym maleńkim chuchnięciem. Myszki mrugały, wąsiki im drżały, ale żadna nie uciekła.",
            "Teraz gniazdko musiało przenieść się z kamienia do kołyski. Do takiej przeprowadzki potrzeba ostrożnych rąk i jeszcze spokojniejszych serc."
          ],
          choices: [
            {
              label: "Ułóż ścieżkę z okruszków",
              response: "Okruszki chleba zaprowadzą myszki prosto na miękką wełnę."
            },
            {
              label: "Poproś smoka o ciepłą ścieżkę",
              response: "Smok ogrzeje kamienie, a myszki przejdą po nich jak po dywanie."
            }
          ],
        },
        {
          title: "Przeprowadzka maleńkich łapek",
          body: [
            "Pierwsza myszka weszła na wełnę. Za nią druga. Na końcu ruszyła najmniejsza, okrągła jak orzech laskowy, a smok prowadził ją ciepłym nosem.",
            "Oliwia trzymała dłonie otwarte i nieruchome. „Już dobrze” – szepnęła. Gustaw podsunął pod kołyskę tarczę, żeby nikt nie spadł.",
            "Kiedy kołyska stanęła w suchej trawie nad brzegiem, smok mrugnął powoli. Tak właśnie mostowe smoki mówią „dziękuję”, gdy nie chcą nikogo obudzić ani spłoszyć."
          ],
          echoes: {
            5: {
              crumbs: "Oliwia ułożyła ścieżkę z okruszków, więc myszki same trafiły do kołyski.",
              "warm-path": "Smok ogrzał kamienie, więc myszki przeszły po cieple."
            }
          },
          paragraphByChoice: {
            5: {
              crumbs: {
                0: "Oliwia pokruszyła skórkę chleba i ułożyła z okruszków ścieżkę od szczeliny aż do kołyski. Pierwsza myszka szła okruszek po okruszku, aż weszła na wełnę. Za nią druga. Najmniejsza zatrzymywała się przy każdym okruszku i zjadała go do ostatniej okruszyny.",
                1: "„Już dobrze” – szepnęła Oliwia. Kiedy wszystkie trzy siedziały w środku, wikliniarz ostrożnie podniósł kołyskę, a Gustaw podsunął pod nią tarczę, żeby nikt nie spadł."
              },
              "warm-path": {
                0: "Smok pochylił się nad murkiem i chuchnął na kamienie, jeden po drugim, od szczeliny aż do kołyski. Kamienie nagrzały się i zajaśniały bursztynowo, jak węgielki, które już nie parzą. Pierwsza myszka przeszła po nich jak po dywanie i weszła na wełnę. Za nią druga.",
                1: "Najmniejsza ruszyła na końcu, a smok prowadził ją ciepłym nosem. Kiedy wszystkie trzy siedziały w środku, wikliniarz ostrożnie podniósł kołyskę, a Gustaw podsunął pod nią tarczę, żeby nikt nie spadł."
              }
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
            "Kiedy myszki były już bezpieczne, smok zszedł z drogi i most znów stał otworem. Oliwia obiecała smokowi, że w gospodzie poprosi wszystkich wędrowców, żeby szli przez most łagodnie. A młynarz przyrzekł, że nazajutrz za mostowe osadzi obluzowany kamień na nowo.",
            "Miecz Gustawa zalśnił w pochwie. Nie dlatego, że ktoś wygrał bitwę. Dlatego, że ktoś mniejszy dostał pomoc.",
            "Księga zaszeleściła kartką. Chciała jeszcze zobaczyć, jak się pożegnają, zanim ścieżka zaprowadzi wędrowców do gospody pełnej świec."
          ],
          choices: [
            {
              label: "Podziękuj smokowi",
              response: "Smok odwdzięczy się darem, który zostanie przy moście."
            },
            {
              label: "Pomachaj na dobranoc",
              response: "Smok mrugnie sennie i pierwszy raz od dawna zaśnie."
            }
          ],
        },
        {
          title: "Na palcach przez most",
          body: [
            "Mieszkańcy wioski przechodzili przez most jeden po drugim. Każdy zerkał w dół, tam gdzie wśród trzcin stała nowa mysia kołyska.",
            "Smok zwinął się na ciepłym kamieniu. Wydawał się teraz mniejszy niż wtedy, gdy wszyscy się go bali, ale wciąż czuwał w pobliżu.",
            "Oliwia zrozumiała, że zamknięta droga czasem czeka na pytanie. I że zanim się ruszy naprzód, najlepiej posłuchać."
          ],
          echoes: {
            7: {
              "name-promise": "Smok usłyszał podziękowanie, więc zostawił mostowi swoją łuskę.",
              "wave-goodnight": "Oliwia pomachała na dobranoc, więc smok mógł wreszcie zasnąć."
            }
          },
          paragraphByChoice: {
            7: {
              "name-promise": {
                0: "Smok podarował mostowi jedną ze swoich miedzianych łusek i ciepłym oddechem osadził ją w murku, tuż przy dawnym mysim domu. Nocą łuska świeciła jak mała latarenka. Każdy, kto przechodził przez most, zwalniał przy niej kroku i stąpał na palcach.",
                1: "Smok czuwał przy kołysce z otwartymi oczami. Nie musiał już zamykać drogi, bo most sam przypominał wszystkim: idź łagodnie, tuż obok mieszkają mali."
              },
              "wave-goodnight": {
                0: "Smok mrugnął sennie, zwinął się wokół kołyski i zasnął, pierwszy raz od dnia, w którym obluzował się kamień. Mieszkańcy przechodzili przez most na paluszkach i uciszali się nawzajem szeptem, żeby go nie obudzić.",
                1: "Z każdym sennym oddechem z nozdrzy smoka ulatywała smużka złotego ciepła. Otulała kołyskę i powoli rozpływała się w ciemności, a myszki spały w cieple aż do rana."
              }
            }
          },
          curiosityNote: {
            title: "Czy wiesz, że...?",
            body: "W dawnej Polsce za przejście przez most trzeba było czasem zapłacić. Taka opłata nazywała się mostowe, a pieniądze miały iść na naprawę mostu."
          },
        },
        {
          title: "To, co zapamiętała księga",
          body: [
            "Długo po tym, jak w gospodzie zgasły świece, przy starym moście spał smok. Obok niego, w trzcinowej kołysce, spały rzeczne myszki.",
            "Na ostatniej stronie księga zapisała cichutko: siła może osłaniać, odwaga może słuchać, a życzliwość potrafi otworzyć nawet najstarszą drogę.",
            "Koniec."
          ],
          echoes: {
            7: {
              "name-promise": "Księga zapamiętała podziękowanie i dar.",
              "wave-goodnight": "Księga zapamiętała ciche „dobranoc”."
            }
          },
          paragraphByChoice: {
            7: {
              "name-promise": {
                0: "Długo po tym, jak w gospodzie zgasły świece, przy starym moście czuwał smok. Obok niego, w trzcinowej kołysce, spały rzeczne myszki, a w murku świeciła miedziana łuska.",
                1: "Na ostatniej stronie księga zapisała cichutko: siła może osłaniać, odwaga może słuchać, a wdzięczność zostawia po sobie światło dla innych."
              },
              "wave-goodnight": {
                0: "Długo po tym, jak w gospodzie zgasły świece, przy starym moście spał smok. Obok niego, w trzcinowej kołysce, spały rzeczne myszki, a nad nimi rozpływały się złote smużki ciepłego, sennego oddechu.",
                1: "Na ostatniej stronie księga zapisała cichutko: siła może osłaniać, odwaga może słuchać, a nawet najwierniejszy strażnik może spokojnie zasnąć, kiedy wie, że nie jest sam."
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
            "Na Księżycowym Wzgórzu wieczorny dzwon co dzień wołał ludzi do domów. Odzywał się wtedy, gdy z kominów szedł niebieskawy dym, a kury szukały w zagrodach swoich grzęd.",
            "Tego wieczoru dzwonnica milczała. Rodziny wyszły na plac w wełnianych chustach, z rogowymi latarniami w rękach, i wszyscy patrzyli w górę, nasłuchując.",
            "Gustaw też zadarł głowę. Oliwia zauważyła tymczasem, że Koniczynka, jego cierpliwa klacz, wyciąga pysk ku ścieżce do starego sadu, gdzie ćmy połyskiwały jak srebrne listki."
          ],
          curiosityNote: {
            title: "Czy wiesz, że...?",
            body: "W średniowieczu wieczorny dzwon przypominał też, żeby przykryć ogień w palenisku, bo nocą łatwo o pożar. Francuzi nazywali go „couvre-feu”, czyli „przykryj ogień”."
          },
        },
        {
          title: "Klucz, lina i koński nos",
          body: [
            "Wójt pomyślał o kluczu do wieży. Piekarz szukał wzrokiem liny od dzwonu. A dzieci patrzyły w stronę sadu, bo Koniczynka wciąż wpatrywała się między grusze.",
            "Oliwię coś ścisnęło w brzuchu, ale wysłuchała każdego po kolei. Wkrótce cała wioska zastanawiała się razem, czemu dzwon milczy i jak mu pomóc.",
            "Można było pójść za końskim nosem, ku srebrnym ćmom. Można też było zapytać najstarszych, czy nie maczał w tym palców górski wiatr."
          ],
          choices: [
            {
              label: "Idź za Koniczynką",
              response: "Koniczynka zaprowadzi wszystkich tam, gdzie migoczą srebrne ćmy."
            },
            {
              label: "Zapytaj starszych",
              response: "Najstarsi pamiętają dawne psoty górskiego wiatru."
            }
          ],
        },
        {
          title: "Lina w gałęziach gruszy",
          body: [
            "Za wieżą okazało się, że po wietrznym popołudniu lina od dzwonu wysunęła się przez otwartą okiennicę i zaplątała wysoko w gałęziach starej gruszy.",
            "Tuż obok spały zięby w gniazdku ukrytym wśród liści, które pachniały deszczem i owocami. Wystarczyło mocniej szarpnąć, a gniazdko mogło spaść z gałęzi.",
            "Dzwon nie zepsuł się na dobre i nie obraził się na wioskę. Czekał na kogoś, kto najpierw dobrze się przyjrzy, a dopiero potem zdecyduje, jak pomóc."
          ],
          echoes: {
            1: {
              "follow-clover": "Koniczynka prowadziła, więc księga dostrzegła znaki w sadzie.",
              "ask-elders": "Wioska zapytała starszych, więc księga przypomniała sobie dawny wiatr."
            }
          },
          paragraphByChoice: {
            1: {
              "follow-clover": {
                0: "Koniczynka zaprowadziła wszystkich za wieżę, prosto pod gruszę. Wokół liny, zaplątanej wysoko w gałęziach, krążyły srebrne ćmy.",
                1: "Do liny przylgnęły gruszkowe liście, a tuż obok spały zięby w gniazdku pachnącym deszczem i owocami. Wystarczyło mocniej szarpnąć, a gniazdko mogło spaść z gałęzi."
              },
              "ask-elders": {
                0: "Babcia Janina zaprowadziła wszystkich za wieżę i pokazała gruszę, która zawsze pochyla się ku dzwonnicy, kiedy z gór zejdzie silniejszy wiatr.",
                1: "Właśnie tam lina zaplątała się wysoko w gałęziach, tuż przy gniazdku zięb ukrytym w liściach pachnących deszczem i owocami. Wystarczyło mocniej szarpnąć, a gniazdko mogło spaść."
              }
            }
          },
        },
        {
          title: "Cicho przy gnieździe",
          body: [
            "Cieśla przyniósł jesionową drabinę i postawił ją tak cicho, że nawet kamienie pod murem niczego nie usłyszały.",
            "Piekarz owinął dolny szczebel płótnem, Oliwia nie spuszczała oczu z puchatego gniazdka, a Koniczynka stała bez ruchu, jakby nawet jej ogon umiał zachować ciszę.",
            "Linę trzeba było uwolnić z głową. Tylko jak być silnym i delikatnym zarazem, kiedy tuż obok śpią ptaki?"
          ],
          choices: [
            {
              label: "Odplątujcie powoli",
              response: "Powolne ruchy pozwolą ziębom spać dalej."
            },
            {
              label: "Zanućcie ziębom kołysankę",
              response: "Cicha kołysanka sprawi, że zięby się nie obudzą."
            }
          ],
        },
        {
          title: "Wolna lina, zachrypnięty dzwon",
          body: [
            "Pętla po pętli lina się luzowała. Jeden gruszkowy liść spadł Oliwii na rękaw, jakby chciał jej powiedzieć, że dobrze wybrała.",
            "Kiedy puścił ostatni supeł, wszyscy uśmiechnęli się bez słowa. Zięby spały dalej, ciepło wtulone pod skrzydło matki.",
            "Lina znów zwisała z wieży. Ale kiedy cieśla lekko za nią pociągnął, rozległ się tylko chrapliwy brzęk, jakby dzwon zachrypł."
          ],
          echoes: {
            3: {
              "move-slowly": "Wszyscy ruszali się powoli, więc w gniazdku było cicho.",
              "lullaby": "Oliwia i Gustaw zanucili kołysankę, więc zięby spały jak zaczarowane."
            }
          },
          paragraphByChoice: {
            3: {
              "move-slowly": {
                0: "Pętla po pętli lina się luzowała, a każda ręka poruszała się wolno jak pyłek w świetle latarni. Jeden gruszkowy liść spadł Oliwii na rękaw.",
                1: "Kiedy puścił ostatni supeł, wszyscy uśmiechnęli się bez słowa. Zięby spały dalej, ciepło wtulone pod skrzydło matki."
              },
              "lullaby": {
                0: "Oliwia i Gustaw zaczęli cichutko nucić kołysankę, a cieśla w jej rytmie luzował linę pętla po pętli. Jeden gruszkowy liść spadł Oliwii na rękaw.",
                1: "Kiedy puścił ostatni supeł, kołysanka ucichła. Zięby spały dalej, ciepło wtulone pod skrzydło matki, a najmniejsza poruszała dzióbkiem, jakby nuciła przez sen."
              }
            }
          },
        },
        {
          title: "Pęknięcie i zapomniane imię",
          body: [
            "W wieży, na brzegu spiżowego dzwonu, biegło pęknięcie cienkie jak włos. Zobaczyli je dopiero wtedy, gdy przysunęli latarnię bardzo blisko.",
            "Cieśla dotknął dzwonu dwoma palcami i pokiwał głową. „Nie ma się co złościć. Dziś w nocy pomożemy mu odzyskać głos”.",
            "Babcia Janina pogładziła spiż. „Kiedyś ten dzwon miał imię. Wołaliśmy go po imieniu, a dziś już nikt go nie pamięta”."
          ],
          choices: [
            {
              label: "Poproś kowalkę o pomoc",
              response: "Kowalka przyniesie mały młoteczek i lśniące nity."
            },
            {
              label: "Przypomnijcie imię dzwonu",
              response: "Babcia Janina poszuka w pamięci imienia, które dzwon dostał na chrzcie."
            }
          ],
        },
        {
          title: "Trzy lśniące nity",
          body: [
            "Przy świecach i przy księżycu mieszkańcy pracowali w kręgu. Kowalka stukała cichutko, cieśla podtrzymywał belkę, a piekarz podawał z rąk do rąk owsiane bułeczki.",
            "Oliwia polerowała dzwon lnianą szmatką, aż zabłysło w nim światło latarni. Na dole Koniczynka nastawiała uszu, czy z góry nie dobiegnie wreszcie jakiś dźwięk.",
            "Milcząca wieża zamieniła się w warsztat, a wszyscy w nim wyglądali jak rodzina zebrana wokół kogoś, kogo nikt nie chciał zostawić samego."
          ],
          echoes: {
            5: {
              "invite-smith": "Przyszła kowalka, więc wieżę wypełniło ostrożne stukanie.",
              "thank-bell": "Babcia Janina przypomniała sobie imię dzwonu, więc spiż się obudził."
            }
          },
          paragraphByChoice: {
            5: {
              "invite-smith": {
                0: "Przy świecach i przy księżycu kowalka małym młoteczkiem wbijała lśniące nity. Cieśla podtrzymywał belkę, a piekarz podawał z rąk do rąk owsiane bułeczki.",
                1: "Między jednym ostrożnym stuknięciem a drugim Oliwia polerowała dzwon lnianą szmatką, aż zabłysło w nim światło latarni. Na dole Koniczynka nastawiała uszu, czy z góry nie dobiegnie wreszcie jakiś dźwięk."
              },
              "thank-bell": {
                0: "Przy świecach i przy księżycu babcia Janina przypomniała sobie imię dzwonu: Wieczornica, bo co wieczór zwoływał sąsiadów. Wszyscy przyłożyli dłonie do dzwonu i razem szepnęli jego imię, a spiż zadrżał ciepło, jakby się budził.",
                1: "Potem Oliwia polerowała dzwon lnianą szmatką, kowalka stukała cichutko, a cieśla podtrzymywał belkę. Na dole Koniczynka nastawiała uszu, czy z góry nie dobiegnie wreszcie jakiś dźwięk."
              }
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
                body: "Dawne dzwony dostawały imiona, a ich poświęcenie nazywano chrztem dzwonu. Słynny dzwon na Wawelu odlano w 1520 roku i nazwano Zygmunt, na cześć króla. Dzwoni do dziś."
              }
            }
          },
        },
        {
          title: "Jak powitać nowy głos",
          body: [
            "Wreszcie dzwon był gotowy. Nie miał już brzmieć tak głośno jak dawniej, ale kowalka się uśmiechnęła: „Cichy głos też potrafi zawołać do domu”.",
            "Nad wieżą księżyc wyjrzał zza chmur. W sadzie poruszyły się zięby, a dzieci na placu wstrzymały oddech. Cała wioska słuchała i czekała.",
            "Księga zawahała się nad ostatnim gestem. Jak powitać nowy głos dzwonu, którego wszyscy tak potrzebowali?"
          ],
          choices: [
            {
              label: "Zadzwoń delikatnie",
              response: "Wioska usłyszy dźwięk cichy, ale taki, jak trzeba."
            },
            {
              label: "Zanućcie razem z dzwonem",
              response: "Do głosu dzwonu dołączą głosy sąsiadów."
            }
          ],
        },
        {
          title: "Dzwon brzmi inaczej",
          body: [
            "Dzwon odezwał się ciszej niż dawniej, ale jasno i miło dla ucha. Nie doleciał na drugi koniec doliny, za to wypełnił wioskę od okna do okna.",
            "Słuchali go rodzice i dzieci, starsi, piekarz, kowalka, cieśla i bardzo dumna Koniczynka, która miała na nosie biały ślad mąki po zjedzonych bułeczkach.",
            "Księżycowe Wzgórze zapamiętało, że dzwon naprawiła cała wioska i każdy dołożył coś od siebie."
          ],
          echoes: {
            7: {
              "ring-gently": "Pociągnięcie było delikatne, więc pierwsza nuta zabrzmiała jasno i czysto.",
              "share-song": "Wioska nuciła razem, więc pierwsza nuta nie była sama."
            }
          },
          paragraphByChoice: {
            7: {
              "ring-gently": {
                0: "Dzwon odezwał się ciszej niż dawniej, ale jasno i miło dla ucha. Delikatne pociągnięcie poniosło nutę od domu do domu.",
                1: "Słuchali go rodzice i dzieci, starsi, piekarz, kowalka, cieśla i bardzo dumna Koniczynka, która miała na nosie biały ślad mąki po zjedzonych bułeczkach."
              },
              "share-song": {
                0: "Dzwon odezwał się ciszej niż dawniej, a mieszkańcy nucili razem z nim, aż nie dało się rozróżnić, gdzie kończy się dzwon, a gdzie zaczynają się głosy.",
                1: "Słuchali go rodzice i dzieci, starsi, piekarz, kowalka, cieśla i bardzo dumna Koniczynka. W sadzie mała zięba podniosła główkę i też nasłuchiwała."
              }
            }
          },
          curiosityNoteByChoice: {
            7: {
              "ring-gently": {
                title: "Czy wiesz, że...?",
                body: "Dzwon umiał mówić różne rzeczy: szybkie bicie znaczyło niebezpieczeństwo, powolne smutek. W górskich wsiach we mgle dzwoniono długo w noc, żeby zabłąkani wędrowcy trafili do domu."
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
            "Długo po kolacji dzwon odpoczywał w wieży nad wioską, a jego naprawiony brzeg połyskiwał w świetle księżyca.",
            "Księżycowe Wzgórze zapamiętało, że to, co ciche, wcale nie jest nieważne. Czasem czeka tylko na pomocne ręce, cierpliwych przyjaciół i łagodną pieśń na nowy początek.",
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
                0: "Długo po kolacji z sadu przyfrunęły srebrne ćmy. Wypolerowany dzwon lśnił w świetle księżyca, więc usiadły na trzech nitach i połyskiwały jak trzy małe gwiazdy.",
                1: "Od tamtej pory wracają co wieczór, gdy dzwon delikatnie woła do domów. A ludzie mówią, że Księżycowe Wzgórze nosi trzy gwiazdki na pamiątkę tamtej nocy."
              },
              "share-song": {
                0: "Długo po kolacji pisklęta zięb wierciły się w gniazdku i przez sen cichutko powtarzały melodię, którą słyszały z placu.",
                1: "Od tamtej pory dzwon woła wioskę do domów wieczorem, a o świcie zięby budzą ją tą samą piosenką. Księżycowe Wzgórze ma teraz dwa głosy: jeden ze spiżu, drugi z piórek."
              }
            }
          },
        }
      ]
    }
  }
};
