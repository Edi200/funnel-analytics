# Funnel Analytics – Write-up

## A feladat értelmezése

A marketingesek csak a végső konverziós rátát látják (pl. 5%), de nem tudják azonosítani, hogy melyik lépésnél veszítik el a legtöbb látogatót. A feladatom egy olyan tool fejlesztése, ami step-by-step vizualizálja a funnel drop-off-okat és láthatóvá teszi a problémás lépéseket.

## Üzleti döntések és dilemmák

Az egyik legfontosabb kérdés ami felmerült bennem, hogy az első step része-e a drop-off flow-nak. Kezdetben egy engage rate metrika irányába gondolkodtam az első stepnél, és az összes utána következő stepnél pedig mérni a drop-off-okat. Később jobban átgondolva egyértelművé vált bennem, hogy az első step is része kell, hogy legyen, de be kell vezetnem még egy mérőt a kritikus drop-off-okra, pl. 75% a drop-off az első stepnél, de a második stepnél is 70%, akkor oda is egy megkülönböztetést rakni, hogy kritikus, és kiemelni az insightsban is.

A rendszer amit kialakítottam:

- **Middle steps:** ha a drop-off < 10%-nál, akkor zöld completion rate, ha nagyobb akkor piros drop-off.
- **Last step:** ha a drop-off < 5%-nál, akkor zöld completion rate, ha nagyobb akkor piros drop-off.
- **Worst step kiemelés:** csak ha meghaladja a küszöböket, ha minden step jól teljesít, pozitív insights jelenik meg.
- **Critical step kiemelés:** ha a drop-off ≥ 60%, de nem a worst step, ezt egy biztonsági rétegként vezettem be, ahogy már le is írtam, ha több step is magas drop-off-ot mutat, akkor ne csak a legrosszabbat jelezzük.

## V1 scope

- Kampánylista overall conversion rate-el és device jelzővel
- Step-szintű funnel vizualizáció drop-off metrikákkal és kétrészes progress bar-ral (proceeds és drop-off összehasonlítása)
- Többszintű vizuális kiemelés, biggest drop-off, high (critical) drop-off, és ha minden jól teljesít akkor zöld mutatók.
- Insights szabályok (maximum 3 rule, priority order szerint)

## Kihagytam V2-re és mit javítanék

Node.js backend valós adatbázissal, felhasználó által állítható dinamikus threshold-ok, szűrők (pl. device, teljesítmény alapú), rendezés (legjobb / legrosszabb), live search kampánynév alapján, chart package integráció, pdf export (report), server-side rendering.

## Architektúra

Vue 3 + Vite + TypeScript SPA, statikus JSON adat frontenden importálva. Két composable: `useCampaigns` (overall conversion rate számítás), `useFunnelMetrics` (drop-off számítás, worst step azonosítás). Három fő komponens: `CampaignCard`, `FunnelStep`, `InsightsPanel`.

## AI használat

A feladat megoldása alatt Claude Chat-et és Cursor IDE-t használtam. Először én elolvastam a feladat leírását, és értelmeztem az egészet, majd a Claude-nak átadtam az egész kontextust, megvitattam a kezdeti lépéseket, és az előrelátható projekt struktúrát. Beküldtem a jelenlegi Claude Chat-be egy előző projektből származó Plan Prompt-ot és leírtam a workflow-t ahogy dolgoztunk. Ami a következőképpen néz ki: Phasek-re osztjuk az egész projektet, ami meg is történt, majd Phasenként beküldöm a Claude által generált plan promptot a Cursor Plan modejába. A Cursor Planjét visszaküldöm a Claude chatbe, és ha minden jó, Phase-n belül is lépésenként implementálom. Miután létrehoztam a projektet, installáltam a TailwindCSS-t, Claude-al készítettem 2 projekt rule-t, mivel ez egy kisebb projekt nem volt többre szükség, és minden Plan elején a Cursor elolvassa ezeket a rule-okat. Claude Code-ot V2-ben használnék nagyobb refaktorálásnál pl. komplex backend logika implementáláshoz.
