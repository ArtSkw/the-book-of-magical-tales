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
    soundOff: "Sound off",
    screenNoteTitle: "Best opened on a wider screen",
    screenNoteBody: "This book opens best on a wider screen. Turn your tablet sideways or use a larger screen so the tales, illustrations, and choices can rest comfortably on the pages.",
    screenNoteClose: "I understand",
    screenNoteContinue: "Open anyway"
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
    soundOff: "Dźwięk wyłączony",
    screenNoteTitle: "Najlepiej otwierać na szerszym ekranie",
    screenNoteBody: "Ta księga najlepiej otwiera się na szerszym ekranie. Obróć tablet poziomo albo usiądź przy większym ekranie, żeby opowieści, ilustracje i wybory zmieściły się wygodnie na stronach.",
    screenNoteClose: "Rozumiem",
    screenNoteContinue: "Otwórz mimo to"
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
            "Między kamieniami rósł mech, miękki jak zielona derka, a pod jedynym łukiem szemrał potok. Na samym środku mostu siedział nieduży miedziany smok. Wcale nie wyglądał groźnie. Wyglądał na zmartwionego.",
            "Nie ryczał i nikogo nie straszył. Siedział prosto, z przednimi łapami opartymi o murek, a ogonem otulał jeden obluzowany kamień, jakby strzegł czegoś bardzo kruchego."
          ],
        },
        {
          title: "Cichy głos spod mostu",
          body: [
            "Smok westchnął i wypuścił z nozdrzy obłoczek tak mały, że zmieściłby się w kubku na mleko. Obłoczek miał złote brzegi i opadał pod most powoli, bardzo powoli.",
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
              response: "W ciszy Oliwia usłyszy najcichsze piśnięcie spod mostu."
            }
          ],
        },
        {
          title: "Kamień z sekretem",
          body: [
            "Oliwia uklękła przy krawędzi mostu i zobaczyła gniazdko rzecznych myszek, wciśnięte między mech, wapno i korzonki trawy.",
            "Najmniejsza myszka schowała się za kamykiem ogrzanym smoczym oddechem. Smok bał się, że ciężkie buty zatrzęsą mostem i wypłoszą maleńką rodzinę z kryjówki.",
            "Smok nie zamknął drogi dla kaprysu. Most miał swój sekret, a smok pilnował tych, którzy są za mali, żeby sami zawołać o pomoc."
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
                1: "Pod spodem Oliwia zobaczyła gniazdko rzecznych myszek, wciśnięte między mech, wapno i korzonki trawy. Najmniejsza myszka schowała się za kamykiem ogrzanym smoczym oddechem."
              },
              listen: {
                0: "Oliwia czekała w ciszy tak długo, aż piśnięcie odezwało się znowu. Dochodziło z brzegu mostu, gdzie mech przykrywał wąską szczelinę między kamieniami.",
                1: "W środku było gniazdko rzecznych myszek, wciśnięte między wapno i korzonki trawy. Najmniejsza myszka drżała za kamykiem ogrzanym smoczym oddechem."
              }
            }
          },
        },
        {
          title: "Plan dla małych myszek",
          body: [
            "Wieczór robił się chłodny, a znad potoku podnosiła się mgła, biała jak wstążka. W omszałej szczelinie myszki drżały i ruszały wąsikami.",
            "Gustaw trzymał latarnię, Oliwia pół bochenka żytniego chleba zawiniętego w lniane płótno, a smok chuchał ciepłem tak delikatnie, że nie zgasiłby nawet świecy.",
            "Trzeba było zacząć od czegoś małego i spokojnego. Od gestu, który nie spłoszy myszek, a smokowi pokaże, że może im zaufać."
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
          title: "Pomoc nadchodzi z młyna",
          body: [
            "Gustaw zatknął czerwony proporzec przy ścieżce do młyna. Proporzec załopotał na wietrze i ludzie we wsi zobaczyli, że na moście dzieje się coś ważnego.",
            "Wkrótce nadszedł młynarz z naręczem owczej wełny, piekarka z czystą chustą i wikliniarz z pękiem trzcin pachnących deszczem. Każde z nich niosło coś innego.",
            "Nikt się nie śmiał, że to taka mała sprawa. Wioska, która umie zatroszczyć się o maleńkie stworzenia, poradzi sobie i z wielkimi sprawami."
          ],
          echoes: {
            3: {
              lantern: "Latarnia świeciła wysoko, więc pomocnicy widzieli, gdzie bezpiecznie stanąć.",
              bread: "Chleb został podzielony, więc myszki odważyły się wyjrzeć."
            }
          },
          paragraphByChoice: {
            3: {
              lantern: {
                0: "Gustaw zatknął czerwony proporzec przy ścieżce do młyna i wysoko uniósł latarnię. Jej światło pokazało najpewniejsze kamienie pod mchem, a proporzec dał znak ludziom we wsi.",
                1: "Wkrótce nadszedł młynarz z naręczem owczej wełny, piekarka z czystą chustą i wikliniarz z pękiem trzcin pachnących deszczem. W jasnym świetle każde wiedziało, gdzie ostrożnie postawić stopę."
              },
              bread: {
                0: "Gustaw zatknął czerwony proporzec przy ścieżce do młyna, a przy omszałej szczelinie czekały okruszki ciepłego chleba. Proporzec załopotał i dał znak ludziom we wsi.",
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
            "Wikliniarz uplótł kołyskę z trzcin, wełny i suchego mchu. Wyszła okrągła jak łupinka orzecha i lekka jak wiosenny liść.",
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
                0: "Oliwia pokruszyła skórkę chleba i ułożyła z okruszków ścieżkę od szczeliny aż do kołyski. Pierwsza myszka szła okruszek po okruszku, aż weszła na wełnę. Za nią druga. Najmniejsza zatrzymywała się przy każdym okruszku i zjadała go do ostatniego.",
                1: "„Już dobrze” – szepnęła Oliwia. Kiedy wszystkie trzy siedziały w środku, wikliniarz ostrożnie podniósł kołyskę, a Gustaw podsunął pod nią tarczę, żeby nikt nie spadł."
              },
              "warm-path": {
                0: "Smok pochylił się nad mostem i chuchnął na kamienie, jeden po drugim, od szczeliny aż do kołyski. Kamienie zrobiły się ciepłe i zalśniły złotawo. Pierwsza myszka przeszła po nich jak po dywanie i weszła na wełnę. Za nią druga.",
                1: "Najmniejsza ruszyła na końcu, a smok prowadził ją ciepłym nosem. Kiedy wszystkie trzy siedziały w środku, wikliniarz ostrożnie podniósł kołyskę, a Gustaw podsunął pod nią tarczę, żeby nikt nie spadł."
              }
            }
          },
          curiosityNote: {
            title: "Czy wiesz, że...?",
            body: "Z trzciny plecie się nie tylko kosze. Dawniej kryto nią dachy chat, a dobrze ułożony trzcinowy dach chronił dom przed deszczem nawet przez kilkadziesiąt lat."
          },
        },
        {
          title: "Obietnica na starym moście",
          body: [
            "Kiedy myszki były już bezpieczne, smok zszedł z drogi. Most znów stał otworem, ale nikt nie przebiegł przez niego w pośpiechu.",
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
          title: "Most znów jest otwarty",
          body: [
            "Mieszkańcy wioski przechodzili przez most jeden po drugim. Każdy zerkał w dół, tam gdzie wśród trzcin stała nowa mysia kołyska.",
            "Smok zwinął się na ciepłym kamieniu. Wydawał się teraz mniejszy niż wtedy, gdy wszyscy się go bali, ale wciąż czuwał w pobliżu.",
            "Oliwia zrozumiała, że zamknięta droga czasem czeka na pytanie. I że zanim się ruszy naprzód, najlepiej najpierw posłuchać."
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
                1: "Smok czuwał przy kołysce z otwartymi oczami. Nie musiał już zamykać drogi, bo most sam przypominał wszystkim: idź łagodnie, tu mieszkają mali."
              },
              "wave-goodnight": {
                0: "Smok mrugnął sennie, zwinął się wokół kołyski i zasnął, pierwszy raz od dnia, w którym obluzował się kamień. Mieszkańcy przechodzili przez most na paluszkach i uciszali się nawzajem szeptem, żeby go nie obudzić.",
                1: "Z każdym sennym oddechem z nozdrzy smoka ulatywał złoty obłoczek. Obłoczki krążyły nad kołyską jak ciepłe świetliki, a myszki spały w cieple przez całą noc."
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
                0: "Długo po tym, jak w gospodzie zgasły świece, przy starym moście spał smok. Obok niego, w trzcinowej kołysce, spały rzeczne myszki, a nad nimi unosiły się złote obłoczki smoczego snu.",
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
            "Gustaw położył dłoń na tarczy. Oliwia zauważyła tymczasem, że Koniczynka, jego cierpliwa klacz, wyciąga pysk ku ścieżce do starego sadu, gdzie ćmy połyskiwały jak srebrne listki."
          ],
          curiosityNote: {
            title: "Czy wiesz, że...?",
            body: "Zanim w domach pojawiły się zegary, wiejski dzwon mówił ludziom, kiedy się zebrać, kiedy pracować, a kiedy wracać do domu. Był jak głos całej wioski."
          },
        },
        {
          title: "Dwie drogi do zagadki",
          body: [
            "Wójt pomyślał o kluczu do wieży. Piekarz spojrzał na linę od dzwonu. A dzieci patrzyły w stronę sadu, bo Koniczynka wciąż wpatrywała się między grusze.",
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
              "ask-elders": "Starsi zostali zapytani, więc księga przypomniała sobie dawny wiatr."
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
          curiosityNote: {
            title: "Czy wiesz, że...?",
            body: "Grusze żyją bardzo długo, a ich wiosenne kwiaty uwielbiają pszczoły. W dawnych wioskach sad był i spiżarnią, i schronieniem dla ptaków."
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
              label: "Trzymajcie mocno drabinę",
              response: "Pewnie trzymana drabina pozwoli pracować spokojnie."
            }
          ],
        },
        {
          title: "Uwolniona lina",
          body: [
            "Pętla po pętli lina się luzowała. Jeden gruszkowy liść spadł Oliwii na rękaw, jakby chciał jej powiedzieć, że dobrze wybrała.",
            "Kiedy puścił ostatni supeł, wszyscy uśmiechnęli się bez słowa. Zięby spały dalej, ciepło wtulone pod skrzydło matki.",
            "Lina znów zwisała z wieży. Ale kiedy cieśla lekko za nią pociągnął, rozległo się tylko głuche stuk, jakby dzwon odchrząknął i zamilkł."
          ],
          echoes: {
            3: {
              "move-slowly": "Wszyscy ruszali się powoli, więc w gniazdku było cicho.",
              "steady-ladder": "Drabina stała pewnie, więc lina bezpiecznie zjechała na dół."
            }
          },
          paragraphByChoice: {
            3: {
              "move-slowly": {
                0: "Pętla po pętli lina się luzowała, a każda ręka poruszała się wolno jak pyłek w świetle latarni. Jeden gruszkowy liść spadł Oliwii na rękaw.",
                1: "Kiedy puścił ostatni supeł, wszyscy uśmiechnęli się bez słowa. Zięby spały dalej, ciepło wtulone pod skrzydło matki."
              },
              "steady-ladder": {
                0: "Drabina stała pewnie pod butami cieśli, więc sięgnął supła i nawet nie trącił gałęzi. Jeden gruszkowy liść spadł Oliwii na rękaw.",
                1: "Kiedy puścił ostatni supeł, cieśla opuścił linę oburącz. Zięby spały dalej, ciepło wtulone pod skrzydło matki."
              }
            }
          },
        },
        {
          title: "Pęknięcie na dzwonie",
          body: [
            "W wieży, na brzegu spiżowego dzwonu, biegło pęknięcie cienkie jak włos. Zobaczyli je dopiero wtedy, gdy przysunęli latarnię bardzo blisko.",
            "Cieśla dotknął dzwonu dwoma palcami i pokiwał głową. „Nie ma się co złościć. Dziś w nocy pomożemy mu odzyskać głos”.",
            "Każdy dołożył coś od siebie. Ktoś znał się na dzwonach, ktoś umiał mocno trzymać drabinę, a ktoś po prostu potrafił dodać otuchy, kiedy było trzeba."
          ],
          choices: [
            {
              label: "Poproś kowalkę o pomoc",
              response: "Kowalka przyniesie mały młoteczek i lśniące nity."
            },
            {
              label: "Podziękujcie dzwonowi",
              response: "Wszyscy potraktują dzwon jak starego przyjaciela, a nie jak zepsutą rzecz."
            }
          ],
          curiosityNote: {
            title: "Czy wiesz, że...?",
            body: "Dawne dzwony odlewano ze spiżu, czyli stopu miedzi i cyny. Spiżowy dzwon ma ciepły głos, który niesie się bardzo daleko."
          },
        },
        {
          title: "Wioska naprawia dzwon",
          body: [
            "Przy świecach i przy księżycu mieszkańcy pracowali w kręgu. Kowalka stukała cichutko, cieśla podtrzymywał belkę, a piekarz podawał z rąk do rąk owsiane bułeczki.",
            "Oliwia polerowała dzwon lnianą szmatką, aż zabłysło w nim światło latarni. Na dole Koniczynka nastawiała uszu, czy z góry nie dobiegnie wreszcie jakiś dźwięk.",
            "Milcząca wieża zamieniła się w warsztat, a wszyscy w nim wyglądali jak rodzina zebrana wokół kogoś, kogo nikt nie chciał zostawić samego."
          ],
          echoes: {
            5: {
              "invite-smith": "Przyszła kowalka, więc wieżę wypełniło ostrożne stukanie.",
              "thank-bell": "Wszyscy podziękowali dzwonowi, więc pracowało się raźniej."
            }
          },
          paragraphByChoice: {
            5: {
              "invite-smith": {
                0: "Przy świecach i przy księżycu kowalka pracowała w kręgu z małym młoteczkiem i lśniącymi nitami. Cieśla podtrzymywał belkę, a piekarz podawał z rąk do rąk owsiane bułeczki.",
                1: "Między jednym ostrożnym stuknięciem a drugim Oliwia polerowała dzwon lnianą szmatką, aż zabłysło w nim światło latarni. Na dole Koniczynka nastawiała uszu, czy z góry nie dobiegnie wreszcie jakiś dźwięk."
              },
              "thank-bell": {
                0: "Przy świecach i przy księżycu mieszkańcy najpierw przyłożyli dłonie do dzwonu i podziękowali mu za wszystkie wieczory, kiedy wołał ich do domów.",
                1: "Potem Oliwia polerowała go lnianą szmatką, kowalka stukała cichutko, a cieśla podtrzymywał belkę. Na dole Koniczynka nastawiała uszu, czy z góry nie dobiegnie wreszcie jakiś dźwięk."
              }
            }
          },
        },
        {
          title: "Jak powitać nowy głos",
          body: [
            "Wreszcie dzwon był gotowy. Nie miał już brzmieć tak głośno jak dawniej, ale kowalka się uśmiechnęła: „Cichy głos też potrafi zawołać do domu”.",
            "Nad wieżą wzeszedł księżyc. W sadzie poruszyły się zięby, a dzieci na placu wstrzymały oddech. Cała wioska słuchała i czekała.",
            "Księga czekała na ostatni gest. Jak powitać nowy głos dzwonu, którego wszyscy tak potrzebowali?"
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
            "Księżycowe Wzgórze zapamiętało, że wspólnota to nie tylko ci, którzy razem siadają do stołu. To także ci, którzy zostają, żeby ten stół naprawić."
          ],
          echoes: {
            7: {
              "ring-gently": "Pociągnięcie było delikatne, więc pierwsza nuta zabrzmiała wyjątkowo.",
              "share-song": "Wioska nuciła razem, więc pierwsza nuta nie była sama."
            }
          },
          paragraphByChoice: {
            7: {
              "ring-gently": {
                0: "Dzwon odezwał się ciszej niż dawniej, ale jasno i miło dla ucha. Delikatne pociągnięcie poniosło nutę od domu do domu, bez zbędnego hałasu.",
                1: "Słuchali go rodzice i dzieci, starsi, piekarz, kowalka, cieśla i bardzo dumna Koniczynka, która miała na nosie biały ślad mąki po zjedzonych bułeczkach."
              },
              "share-song": {
                0: "Dzwon odezwał się ciszej niż dawniej, a mieszkańcy nucili razem z nim, aż nie dało się rozróżnić, gdzie kończy się dzwon, a gdzie zaczynają się głosy.",
                1: "Słuchali go rodzice i dzieci, starsi, piekarz, kowalka, cieśla i bardzo dumna Koniczynka. Nawet zięby w sadzie spały spokojnie."
              }
            }
          },
        },
        {
          title: "Pieśń na dobranoc",
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
                0: "Długo po kolacji dzwon czuwał w wieży nad wioską, a przy jego naprawionym brzegu wciąż jakby krążyła jedna jasna, srebrna nuta.",
                1: "Księżycowe Wzgórze zapamiętało, że to, co ciche, wcale nie jest nieważne. Czasem czeka tylko na pomocne ręce, cierpliwych przyjaciół i jedno ostrożne pociągnięcie."
              },
              "share-song": {
                0: "Długo po kolacji dzwon czuwał w wieży nad wioską, a melodia, którą zanucili sąsiedzi, jakby wciąż unosiła się pod księżycem.",
                1: "Księżycowe Wzgórze zapamiętało, że to, co ciche, wcale nie jest nieważne. Czasem czeka tylko na pomocne ręce, cierpliwych przyjaciół i łagodną pieśń na nowy początek."
              }
            }
          },
        }
      ]
    }
  }
};
