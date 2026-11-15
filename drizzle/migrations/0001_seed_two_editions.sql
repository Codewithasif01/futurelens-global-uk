
insert into public.authors (id, slug, name, role_title, bio, avatar_url, x_handle) values
('00000000-0000-4000-8000-00000000a001','maya-chen','Maya Chen','Senior technology correspondent','Maya covers the US technology industry from San Francisco.',null,'@mayachen'),
('00000000-0000-4000-8000-00000000a002','oliver-hart','Oliver Hart','UK science editor','Oliver leads science coverage for FutureLens UK from London.',null,'@oliverhart'),
('00000000-0000-4000-8000-00000000a003','lena-fischer','Lena Fischer','Europe correspondent','Lena reports on EU policy and European research from Brussels.',null,'@lenafischer'),
('00000000-0000-4000-8000-00000000a004','dev-patel','Dev Patel','AI and computing reporter','Dev writes about AI, chips and quantum computing for both editions.',null,'@devpatel');

insert into public.categories (id, site, slug, name, description, position) values
('00000000-0000-4000-8000-0000000c0101','com','ai','AI & Computing','Artificial intelligence, chips and quantum computing.',1),
('00000000-0000-4000-8000-0000000c0102','com','space','Space','Launches, missions and the space economy.',2),
('00000000-0000-4000-8000-0000000c0103','com','energy','Energy & Climate','Fusion, renewables and the grid.',3),
('00000000-0000-4000-8000-0000000c0104','com','policy','Policy','Tech policy from Washington and beyond.',4),
('00000000-0000-4000-8000-0000000c0105','com','science','Science','Research breakthroughs and what they mean.',5),
('00000000-0000-4000-8000-0000000c0201','uk','ai','AI & Computing','Artificial intelligence, chips and quantum computing.',1),
('00000000-0000-4000-8000-0000000c0202','uk','space','Space','ESA, the UK Space Agency and the space economy.',2),
('00000000-0000-4000-8000-0000000c0203','uk','energy','Energy & Climate','Fusion, offshore wind and the grid.',3),
('00000000-0000-4000-8000-0000000c0204','uk','policy','Policy & Regulation','UK tech policy, Ofcom, the ICO and EU regulation.',4),
('00000000-0000-4000-8000-0000000c0205','uk','science','Science','UK and European research, from CERN to the NHS.',5);

insert into public.tags (id, site, slug, name) values
('00000000-0000-4000-8000-0000000d0101','com','quantum','Quantum'),
('00000000-0000-4000-8000-0000000d0102','com','nasa','NASA'),
('00000000-0000-4000-8000-0000000d0103','com','startups','Startups'),
('00000000-0000-4000-8000-0000000d0104','com','fusion','Fusion'),
('00000000-0000-4000-8000-0000000d0105','com','europe-watch','Europe Watch'),
('00000000-0000-4000-8000-0000000d0201','uk','quantum','Quantum'),
('00000000-0000-4000-8000-0000000d0202','uk','esa','ESA'),
('00000000-0000-4000-8000-0000000d0203','uk','cern','CERN'),
('00000000-0000-4000-8000-0000000d0204','uk','eu-ai-act','EU AI Act'),
('00000000-0000-4000-8000-0000000d0205','uk','fusion','Fusion'),
('00000000-0000-4000-8000-0000000d0206','uk','nhs','NHS');

insert into public.posts (id, slug, title, excerpt, body, featured_image, image_alt, author_id, sites, primary_site, region, status, published_at) values
-- .com only
('00000000-0000-4000-8000-000000000101','quantum-logical-qubits-race','The race to 1,000 logical qubits is now a two-horse sprint','American labs are closing in on error-corrected machines large enough to do useful chemistry.',
$b$Two US labs now say they can build a quantum computer with 1,000 error-corrected logical qubits before the end of the decade, the threshold most researchers consider useful for real chemistry and materials work.

## Why logical qubits matter

Physical qubits are noisy. Grouping hundreds of them into one logical qubit lets errors be detected and fixed faster than they spread. The latest roadmaps cut that overhead sharply, which is why the timeline moved.

## What to watch

Expect the first customer programs to target battery chemistry and fertilizer catalysts, where even modest simulations are worth billions of dollars.$b$,
'/images/posts/quantum-chip.jpg','Quantum processor inside a dilution refrigerator','00000000-0000-4000-8000-00000000a004','{com}','com','us','published', now() - interval '3 hours'),
('00000000-0000-4000-8000-000000000102','artemis-iii-rehearsals','Artemis III crew begins final lunar landing rehearsals','NASA astronauts are spending long days in simulators as the agency targets its first crewed landing in half a century.',
$b$NASA's Artemis III crew has started the last block of landing rehearsals in Houston, running full descent profiles in the lander simulator several times a week.

## The hardest ten minutes

The powered descent to the lunar south pole is the riskiest part of the mission. Crews practice it with failed sensors, poor lighting and fuel margins cut to the bone.

## Schedule pressure

The agency has not moved the target date, but officials concede the lander's in-orbit refueling demonstration remains the long pole.$b$,
'/images/posts/rocket-launch.jpg','Rocket lifting off at dawn','00000000-0000-4000-8000-00000000a001','{com}','com','us','published', now() - interval '10 hours'),
('00000000-0000-4000-8000-000000000103','texas-ai-data-centers','Inside the Texas data center boom powering the AI economy','Cheap land, fast permits and an independent grid have turned Texas into the center of America''s AI buildout.',
$b$Drive an hour outside Dallas and the skyline is cranes and substations. Texas now hosts more planned data center capacity than any other state.

## Power is the bottleneck

Operators say chips are no longer the constraint; electricity is. Several campuses are signing deals for on-site gas turbines and, eventually, small modular reactors.

## The local view

County officials welcome the tax base but worry about water use during summer heat waves.$b$,
'/images/posts/ai-datacenter.jpg','Rows of servers in a data center','00000000-0000-4000-8000-00000000a001','{com}','com','us','published', now() - interval '1 day'),
('00000000-0000-4000-8000-000000000104','federal-fusion-pilot-plants','Federal fusion program funds three pilot plants','The Department of Energy''s milestone program moves from paper designs to steel.',
$b$The Department of Energy has awarded the next round of milestone funding to three private fusion companies, moving the program from design reviews to hardware.

## How the money flows

Companies are paid only when they hit agreed technical milestones, a model borrowed from NASA's commercial cargo program.

## Skeptics remain

Critics note that none of the funded designs has yet produced net energy, and that the grid timelines in company pitch decks are optimistic.$b$,
'/images/posts/fusion.jpg','Plasma glowing inside a tokamak','00000000-0000-4000-8000-00000000a004','{com}','com','us','published', now() - interval '2 days'),
('00000000-0000-4000-8000-000000000105','ai-designed-antibodies','Biotech startups bet on AI-designed antibodies','A wave of Boston and Bay Area startups says generative models can cut drug discovery from years to months.',
$b$A new generation of biotech startups is using generative models to design antibodies from scratch, rather than screening millions of candidates in the lab.

## From screen to design

The approach flips the traditional workflow. Models propose sequences; robots synthesize and test the most promising few hundred.

## Proof still pending

No AI-designed antibody has yet completed a Phase 3 trial. Investors are betting the first approvals arrive before 2030.$b$,
'/images/posts/biotech.jpg','Scientist pipetting samples in a lab','00000000-0000-4000-8000-00000000a001','{com}','com','us','published', now() - interval '3 days'),
('00000000-0000-4000-8000-000000000106','europe-chip-subsidies-us-fabs','Europe Watch: what Brussels'' chip subsidies mean for US fabs','The EU wants a bigger share of global chipmaking. American manufacturers are watching closely.',
$b$The European Union is preparing a second round of semiconductor subsidies, and US chipmakers with plants in Ireland and Germany stand to benefit.

## A transatlantic tug of war

Washington's own incentives pulled several projects back to Arizona and Ohio. Brussels now hopes to win some of them back.

## What US readers should know

The new rules favor advanced packaging and research centers over leading-edge fabs, an area where American firms are already strong.$b$,
'/images/posts/quantum-chip.jpg','Close-up of a processor','00000000-0000-4000-8000-00000000a003','{com}','com','europe','published', now() - interval '4 days'),
('00000000-0000-4000-8000-000000000107','satellite-internet-10-million','Satellite internet passes 10 million subscribers worldwide','Low Earth orbit broadband has gone from novelty to utility in five years.',
$b$Satellite broadband from low Earth orbit has passed 10 million paying subscribers worldwide, according to industry estimates.

## Who is signing up

Rural households remain the core market, but airlines, shipping and the military now account for a growing share of revenue.

## Crowded skies

Astronomers continue to warn about the impact of tens of thousands of satellites on ground-based observation.$b$,
'/images/posts/rocket-launch.jpg','Rocket launch over the ocean','00000000-0000-4000-8000-00000000a004','{com}','com','global','published', now() - interval '6 days'),
('00000000-0000-4000-8000-000000000108','germany-offshore-wind-us-investors','Europe Watch: Germany''s offshore wind auctions draw US investors','American infrastructure funds are among the biggest bidders in the North Sea.',
$b$US infrastructure funds have emerged as major bidders in Germany's latest offshore wind auctions, attracted by long-term contracts and stable regulation.

## Why now

Higher interest rates have cooled the US offshore market, sending capital to Europe in search of projects with clearer timelines.

## The catch

German auctions now include penalties for delays, a lesson learned after several projects stalled.$b$,
'/images/posts/offshore-wind.jpg','Offshore wind turbines at sea','00000000-0000-4000-8000-00000000a003','{com}','com','europe','published', now() - interval '8 days'),
-- .co.uk only
('00000000-0000-4000-8000-000000000201','uk-ai-security-institute-audit','UK AI Security Institute publishes its first frontier model audit','The government-backed body tested four leading models for cyber and biological risks.',
$b$The UK's AI Security Institute has published its first full audit of frontier AI models, testing four systems for dangerous capabilities in cyber security and biology.

## What it found

None of the models could carry out an end-to-end attack unaided, but two gave meaningful uplift to novice users in specific tasks.

## What happens next

Ministers say the findings will inform the government's long-promised AI bill. Industry groups have welcomed the transparency but questioned the testing methodology.$b$,
'/images/posts/ai-datacenter.jpg','Server racks in a data centre','00000000-0000-4000-8000-00000000a002','{uk}','uk','uk','published', now() - interval '2 hours'),
('00000000-0000-4000-8000-000000000202','esa-mars-rover-launch-window','ESA confirms launch window for Europe''s Mars rover','The Rosalind Franklin rover, built largely in Stevenage, is back on track after years of delay.',
$b$The European Space Agency has confirmed the launch window for the Rosalind Franklin rover, the centrepiece of its ExoMars programme.

## Built in Britain

Much of the rover was assembled in Stevenage, and British teams lead several of its instruments, including the drill that will sample two metres below the surface.

## A long road

The mission was originally a partnership with Russia. After that collaboration ended, ESA rebuilt the landing platform with new partners.$b$,
'/images/posts/rocket-launch.jpg','Rocket lifting off at dawn','00000000-0000-4000-8000-00000000a003','{uk}','uk','europe','published', now() - interval '7 hours'),
('00000000-0000-4000-8000-000000000203','cern-future-circular-collider','CERN moves ahead with Future Circular Collider study','Member states back the next phase of a 91km successor to the Large Hadron Collider.',
$b$CERN's council has backed the next phase of work on the Future Circular Collider, a proposed 91-kilometre ring beneath France and Switzerland.

## The case for

Physicists argue a Higgs factory is the clearest route to new physics. The UK, a founding member, has signalled support in principle.

## The cost question

With an estimated price tag of more than 15 billion Swiss francs, funding will be the defining debate of the next five years.$b$,
'/images/posts/collider.jpg','Inside the collider tunnel','00000000-0000-4000-8000-00000000a002','{uk}','uk','europe','published', now() - interval '20 hours'),
('00000000-0000-4000-8000-000000000204','ofcom-ai-content-rules','Ofcom sets out rules for AI-generated content on UK broadcasters','Broadcasters will need to label synthetic presenters and disclose AI use in news programmes.',
$b$Ofcom has published draft guidance requiring UK broadcasters to label AI-generated presenters and disclose when synthetic material appears in news programmes.

## Labelling and trust

The regulator says audiences are comfortable with AI behind the scenes but want to know when what they see on screen is not real.

## Consultation

The consultation runs for twelve weeks. Public service broadcasters have broadly welcomed the proposals.$b$,
'/images/posts/westminster.jpg','Houses of Parliament at dusk','00000000-0000-4000-8000-00000000a002','{uk}','uk','uk','published', now() - interval '36 hours'),
('00000000-0000-4000-8000-000000000205','north-sea-wind-record','North Sea wind farms break UK generation record','Offshore wind supplied more than half of Britain''s electricity during a blustery weekend.',
$b$Offshore wind farms supplied more than half of Great Britain's electricity for a full day for the first time, according to grid operator data.

## Behind the record

New turbines off the Yorkshire and Norfolk coasts came online this autumn, adding several gigawatts of capacity.

## Grid constraints

Despite the record, some turbines were paid to switch off because transmission lines to the south could not carry the power.$b$,
'/images/posts/offshore-wind.jpg','Offshore wind farm under a grey sky','00000000-0000-4000-8000-00000000a002','{uk}','uk','uk','published', now() - interval '3 days'),
('00000000-0000-4000-8000-000000000206','oxford-quantum-networking-raise','Oxford spin-out raises £40m for quantum networking','The start-up wants to link quantum computers across cities using existing fibre.',
$b$An Oxford University spin-out has raised £40m to commercialise quantum networking technology that links processors over standard fibre-optic cables.

## Why networking matters

Linking smaller machines may prove easier than building one enormous quantum computer, the company argues.

## Backing

The round was led by a British growth fund, with participation from the National Security Strategic Investment Fund.$b$,
'/images/posts/quantum-chip.jpg','Quantum processor','00000000-0000-4000-8000-00000000a004','{uk}','uk','uk','published', now() - interval '4 days'),
('00000000-0000-4000-8000-000000000207','eu-ai-act-british-firms','EU AI Act: what changes for British firms selling into Europe','Brexit did not take UK companies out of scope. Here is what they need to do before the next deadline.',
$b$British companies that sell AI products into the European Union must comply with the EU AI Act, regardless of where they are based.

## Who is in scope

Any provider placing an AI system on the EU market is covered. High-risk uses such as recruitment and credit scoring face the strictest rules.

## Practical steps

Lawyers advise firms to map their systems now, appoint an EU representative where required, and prepare technical documentation.$b$,
'/images/posts/westminster.jpg','Parliament at blue hour','00000000-0000-4000-8000-00000000a003','{uk}','uk','europe','published', now() - interval '5 days'),
('00000000-0000-4000-8000-000000000208','nhs-ai-triage-trial','NHS trials AI triage across 30 hospital trusts','The pilot will test whether AI can shorten waits in A&E without compromising safety.',
$b$NHS England is trialling AI-assisted triage in emergency departments at 30 hospital trusts, with results expected next year.

## How it works

Patients describe symptoms on a tablet; the system suggests a priority score that a nurse reviews and can overrule.

## Safeguards

The programme has been approved by the MHRA as a clinical investigation, and patients can opt out.$b$,
'/images/posts/biotech.jpg','Scientist in a laboratory','00000000-0000-4000-8000-00000000a002','{uk}','uk','uk','published', now() - interval '7 days'),
-- Shared
('00000000-0000-4000-8000-000000000301','fusion-grid-2035','The fusion startups racing to put power on the grid by 2035','A dozen private companies say commercial fusion is a decade away. Here is who is closest.',
$b$More than a dozen private fusion companies now say they will deliver electricity to the grid by 2035. Investors have put over $7 billion behind them.

## The front runners

Magnetic confinement designs lead the pack, helped by high-temperature superconducting magnets that shrink reactor size dramatically.

## What could go wrong

Materials that survive years of neutron bombardment remain unproven, and regulators are still writing the rules.$b$,
'/images/posts/fusion.jpg','Plasma inside a fusion reactor','00000000-0000-4000-8000-00000000a004','{com,uk}','com','global','published', now() - interval '5 hours'),
('00000000-0000-4000-8000-000000000302','eu-sovereign-cloud','Europe''s sovereign cloud push, explained','Brussels and national governments want data stored and controlled in Europe. What does that mean in practice?',
$b$European governments are pushing for "sovereign cloud" services that keep data, encryption keys and operational control inside the EU.

## Why now

Concerns about foreign access to data, sharpened by new US surveillance rules, have moved the debate from think tanks to procurement rules.

## Who benefits

European providers hope to win public-sector contracts, while large American firms are setting up locally run subsidiaries to stay in the game.$b$,
'/images/posts/ai-datacenter.jpg','Data centre corridor','00000000-0000-4000-8000-00000000a003','{com,uk}','uk','europe','published', now() - interval '1 day 4 hours'),
('00000000-0000-4000-8000-000000000303','webb-water-exoplanet','Webb telescope spots a water-rich atmosphere on a nearby exoplanet','The planet, 40 light-years away, is the smallest yet with a clear water signature.',
$b$The James Webb Space Telescope has detected water vapour in the atmosphere of a rocky planet 40 light-years from Earth, the smallest world yet with such a clear signal.

## A careful claim

The team ruled out starspots as a source of the signal, a common confounder in earlier observations.

## Next steps

Follow-up observations next year will look for carbon dioxide and methane.$b$,
'/images/posts/rocket-launch.jpg','Launch at sunrise','00000000-0000-4000-8000-00000000a001','{com,uk}','com','global','published', now() - interval '2 days'),
('00000000-0000-4000-8000-000000000304','cern-antimatter-gravity','CERN experiment confirms gravity pulls antimatter down','Antihydrogen atoms fall just like ordinary matter, ruling out exotic "antigravity" theories.',
$b$Physicists at CERN have confirmed that antihydrogen atoms fall downwards under gravity, matching the behaviour of ordinary matter to within the experiment's precision.

## Why it matters

Some speculative theories suggested antimatter might be repelled by gravity. The result rules out the strongest versions of that idea.

## Built with British kit

Several key detector components were designed at UK universities.$b$,
'/images/posts/collider.jpg','Collider tunnel at CERN','00000000-0000-4000-8000-00000000a002','{com,uk}','uk','europe','published', now() - interval '6 days');

-- Edition adaptations on two shared stories
insert into public.post_site_overrides (post_id, site, title, excerpt, slug, seo_title, seo_description, editor_note) values
('00000000-0000-4000-8000-000000000301','uk','The fusion start-ups racing to put power on the grid by 2035',
 'From Oxfordshire to Nottinghamshire, British companies are among those promising commercial fusion within a decade.',
 null,'Fusion start-ups and the 2035 grid target: where Britain stands',
 'Which fusion start-ups could deliver power by 2035, and how the UK''s STEP programme fits in.',
 'UK readers: our explainer on the STEP prototype plant at West Burton follows next week.'),
('00000000-0000-4000-8000-000000000302','com','Why Europe wants its own cloud, and what it means for AWS, Azure and Google',
 'Europe''s sovereign cloud rules could reshape how American hyperscalers operate across the Atlantic.',
 'europe-sovereign-cloud-us-providers','Europe''s sovereign cloud push: what it means for US cloud providers',
 'How EU sovereign cloud rules affect AWS, Microsoft Azure and Google Cloud.',
 'Part of our Europe Watch series for US readers.');

insert into public.post_categories (post_id, category_id) values
('00000000-0000-4000-8000-000000000101','00000000-0000-4000-8000-0000000c0101'),
('00000000-0000-4000-8000-000000000102','00000000-0000-4000-8000-0000000c0102'),
('00000000-0000-4000-8000-000000000103','00000000-0000-4000-8000-0000000c0101'),
('00000000-0000-4000-8000-000000000104','00000000-0000-4000-8000-0000000c0103'),
('00000000-0000-4000-8000-000000000105','00000000-0000-4000-8000-0000000c0105'),
('00000000-0000-4000-8000-000000000106','00000000-0000-4000-8000-0000000c0104'),
('00000000-0000-4000-8000-000000000107','00000000-0000-4000-8000-0000000c0102'),
('00000000-0000-4000-8000-000000000108','00000000-0000-4000-8000-0000000c0103'),
('00000000-0000-4000-8000-000000000201','00000000-0000-4000-8000-0000000c0204'),
('00000000-0000-4000-8000-000000000202','00000000-0000-4000-8000-0000000c0202'),
('00000000-0000-4000-8000-000000000203','00000000-0000-4000-8000-0000000c0205'),
('00000000-0000-4000-8000-000000000204','00000000-0000-4000-8000-0000000c0204'),
('00000000-0000-4000-8000-000000000205','00000000-0000-4000-8000-0000000c0203'),
('00000000-0000-4000-8000-000000000206','00000000-0000-4000-8000-0000000c0201'),
('00000000-0000-4000-8000-000000000207','00000000-0000-4000-8000-0000000c0204'),
('00000000-0000-4000-8000-000000000208','00000000-0000-4000-8000-0000000c0205'),
('00000000-0000-4000-8000-000000000301','00000000-0000-4000-8000-0000000c0103'),
('00000000-0000-4000-8000-000000000301','00000000-0000-4000-8000-0000000c0203'),
('00000000-0000-4000-8000-000000000302','00000000-0000-4000-8000-0000000c0104'),
('00000000-0000-4000-8000-000000000302','00000000-0000-4000-8000-0000000c0204'),
('00000000-0000-4000-8000-000000000303','00000000-0000-4000-8000-0000000c0105'),
('00000000-0000-4000-8000-000000000303','00000000-0000-4000-8000-0000000c0205'),
('00000000-0000-4000-8000-000000000304','00000000-0000-4000-8000-0000000c0105'),
('00000000-0000-4000-8000-000000000304','00000000-0000-4000-8000-0000000c0205');

insert into public.post_tags (post_id, tag_id) values
('00000000-0000-4000-8000-000000000101','00000000-0000-4000-8000-0000000d0101'),
('00000000-0000-4000-8000-000000000102','00000000-0000-4000-8000-0000000d0102'),
('00000000-0000-4000-8000-000000000104','00000000-0000-4000-8000-0000000d0104'),
('00000000-0000-4000-8000-000000000105','00000000-0000-4000-8000-0000000d0103'),
('00000000-0000-4000-8000-000000000106','00000000-0000-4000-8000-0000000d0105'),
('00000000-0000-4000-8000-000000000108','00000000-0000-4000-8000-0000000d0105'),
('00000000-0000-4000-8000-000000000301','00000000-0000-4000-8000-0000000d0104'),
('00000000-0000-4000-8000-000000000301','00000000-0000-4000-8000-0000000d0103'),
('00000000-0000-4000-8000-000000000302','00000000-0000-4000-8000-0000000d0105'),
('00000000-0000-4000-8000-000000000202','00000000-0000-4000-8000-0000000d0202'),
('00000000-0000-4000-8000-000000000203','00000000-0000-4000-8000-0000000d0203'),
('00000000-0000-4000-8000-000000000206','00000000-0000-4000-8000-0000000d0201'),
('00000000-0000-4000-8000-000000000207','00000000-0000-4000-8000-0000000d0204'),
('00000000-0000-4000-8000-000000000208','00000000-0000-4000-8000-0000000d0206'),
('00000000-0000-4000-8000-000000000301','00000000-0000-4000-8000-0000000d0205'),
('00000000-0000-4000-8000-000000000304','00000000-0000-4000-8000-0000000d0203');

insert into public.homepage_picks (site, slot, post_id, position) values
('com','hero','00000000-0000-4000-8000-000000000301',0),
('com','featured','00000000-0000-4000-8000-000000000101',0),
('com','featured','00000000-0000-4000-8000-000000000102',1),
('com','featured','00000000-0000-4000-8000-000000000103',2),
('uk','hero','00000000-0000-4000-8000-000000000201',0),
('uk','featured','00000000-0000-4000-8000-000000000302',0),
('uk','featured','00000000-0000-4000-8000-000000000203',1),
('uk','featured','00000000-0000-4000-8000-000000000202',2);

insert into public.navigation (site, menu, label, href, position) values
('com','header','AI & Computing','/category/ai',0),
('com','header','Space','/category/space',1),
('com','header','Energy','/category/energy',2),
('com','header','Policy','/category/policy',3),
('com','header','Science','/category/science',4),
('com','header','Europe Watch','/region/europe',5),
('com','footer','About FutureLens','/pages/about',0),
('com','footer','Contact','/pages/contact',1),
('com','footer','RSS feed','/rss.xml',2),
('com','legal','Privacy Policy','/pages/privacy-policy',0),
('com','legal','Cookie Policy','/pages/cookie-policy',1),
('com','legal','Terms of Use','/pages/terms',2),
('com','legal','Do Not Sell or Share My Personal Information','/pages/do-not-sell',3),
('uk','header','UK & Europe','/region/uk',0),
('uk','header','AI & Computing','/category/ai',1),
('uk','header','Space','/category/space',2),
('uk','header','Energy','/category/energy',3),
('uk','header','Policy & Regulation','/category/policy',4),
('uk','header','Science','/category/science',5),
('uk','footer','About FutureLens UK','/pages/about',0),
('uk','footer','Contact','/pages/contact',1),
('uk','footer','RSS feed','/rss.xml',2),
('uk','legal','Privacy Policy','/pages/privacy-policy',0),
('uk','legal','Cookie Policy','/pages/cookie-policy',1),
('uk','legal','Terms of Use','/pages/terms',2),
('uk','legal','Complaints','/pages/complaints',3);

insert into public.site_settings (site, tagline, default_seo_title, default_seo_description, legal_entity_name, company_number, registered_address, vat_number, ico_registration, contact_email, footer_note, consent_title, consent_body, privacy_page_slug, cookie_page_slug, do_not_sell_page_slug, ads_enabled) values
('com','Technology and science, seen clearly.','FutureLens: technology and science news','Independent reporting on the technology, science and policy shaping what comes next.',
 '[FutureLens Media, Inc.]',null,'[Street address, City, State ZIP, United States]',null,null,'[privacy@futurelens.com]',
 'FutureLens is the global edition. Readers in Britain and Europe can switch to FutureLens UK.',
 'Your privacy choices',
 'We use essential cookies to run this site. With your permission we also use analytics cookies to understand readership and advertising cookies to fund our journalism. You can change your choices at any time.',
 'privacy-policy','cookie-policy','do-not-sell',true),
('uk','Technology and science for Britain and Europe.','FutureLens UK: technology and science news','Independent reporting on the technology, science and regulation shaping Britain and Europe.',
 '[FutureLens Media Ltd]','[Company number 00000000]','[Registered office: address, London, postcode, United Kingdom]','[GB 000 0000 00]','[ICO registration ZA000000]','[privacy@futurelens.co.uk]',
 'FutureLens UK is published by the company named below. Registered in England and Wales.',
 'Cookies on FutureLens UK',
 'We use strictly necessary cookies to make this site work. We''d also like to set optional analytics cookies to help us improve it, and advertising cookies to fund our journalism. We won''t set optional cookies unless you allow them.',
 'privacy-policy','cookie-policy',null,true);

insert into public.pages (site, slug, title, kind, body, seo_description) values
('com','about','About FutureLens','standard',$p$FutureLens is an independent publication covering the technology, science and policy shaping what comes next. This is the global edition, written for readers in the United States and around the world, with a dedicated Europe Watch section.

[Add your mission statement, editorial standards and team here.]$p$,'About the FutureLens global edition.'),
('com','contact','Contact','standard',$p$Newsroom: [newsroom@futurelens.com]

Corrections: [corrections@futurelens.com]

Advertising: [ads@futurelens.com]$p$,'How to contact FutureLens.'),
('com','privacy-policy','Privacy Policy','legal',$p$Last updated: [date]

This policy explains how [FutureLens Media, Inc.] ("we") collects and uses personal information on futurelens.com.

## Who we are

[Legal entity name, registered address, contact email.]

## Information we collect

[Newsletter email addresses, analytics data collected with consent, advertising identifiers collected with consent.]

## Visitors in the EU and UK

If you are in the European Economic Area or the United Kingdom, we process your data under the GDPR / UK GDPR. Our lawful bases are [consent / legitimate interests / contract]. You have the right to access, correct, delete, restrict and port your data, and to complain to your local supervisory authority.

## US state privacy rights

Residents of California and other US states with privacy laws may have the right to know, delete, correct, and opt out of the sale or sharing of personal information. See [Do Not Sell or Share My Personal Information](/pages/do-not-sell). We honour Global Privacy Control signals.

## Contact

[privacy@futurelens.com]$p$,'How FutureLens handles personal information, including GDPR and US state privacy rights.'),
('com','cookie-policy','Cookie Policy','legal',$p$Last updated: [date]

## Essential cookies

These keep the site working and remember your privacy choices. They cannot be switched off.

## Analytics cookies

[Name of analytics provider] helps us understand which stories are read. Set only with your consent where the law requires it.

## Advertising cookies

[Ad partners] help fund our journalism. Set only with your consent where the law requires it. US readers can opt out at any time.

You can change your choices from the Cookie settings link in the footer.$p$,'Which cookies FutureLens uses and how to control them.'),
('com','terms','Terms of Use','legal',$p$[Insert terms of use for futurelens.com, including governing law in [State], United States.]$p$,'Terms of use for futurelens.com.'),
('com','do-not-sell','Do Not Sell or Share My Personal Information','legal',$p$Under the California Consumer Privacy Act (as amended by the CPRA) and similar state laws, you can opt out of the "sale" or "sharing" of your personal information for cross-context behavioural advertising.

Use the Cookie settings link in the footer and turn off advertising cookies, or enable Global Privacy Control in your browser, which we honour automatically.

[Add any additional request methods, such as an email address or form, here.]$p$,'Opt out of the sale or sharing of personal information.'),
('uk','about','About FutureLens UK','standard',$p$FutureLens UK is the UK and Europe edition of FutureLens, covering technology, science and regulation from Westminster and Brussels to ESA and CERN.

[Add your mission statement, editorial standards and UK team here.]$p$,'About the FutureLens UK edition.'),
('uk','contact','Contact','standard',$p$Newsroom: [newsroom@futurelens.co.uk]

Corrections and complaints: [complaints@futurelens.co.uk]

Advertising: [ads@futurelens.co.uk]$p$,'How to contact FutureLens UK.'),
('uk','privacy-policy','Privacy Policy','legal',$p$Last updated: [date]

This policy explains how [FutureLens Media Ltd] ("we", "us") uses your personal data on futurelens.co.uk, in line with the UK General Data Protection Regulation (UK GDPR), the Data Protection Act 2018 and the Privacy and Electronic Communications Regulations (PECR).

## Data controller

[FutureLens Media Ltd], [registered office address]. Company number [00000000]. We are registered with the Information Commissioner's Office (ICO) under registration number [ZA000000].

## What we collect and why

- Newsletter sign-ups: your email address, processed on the basis of your consent.
- Analytics: only with your consent under PECR.
- Advertising: only with your consent under PECR.

## International transfers

[Describe any transfers outside the UK and the safeguards used, such as the UK International Data Transfer Agreement.]

## Your rights

You have the right to access, rectify, erase, restrict, object to and port your data, and to withdraw consent at any time. You can complain to the ICO at ico.org.uk or on 0303 123 1113.

## Contact

[privacy@futurelens.co.uk]$p$,'How FutureLens UK uses personal data under UK GDPR and PECR.'),
('uk','cookie-policy','Cookie Policy','legal',$p$Last updated: [date]

Under PECR we must ask for your consent before setting any cookie that is not strictly necessary.

## Strictly necessary

Used to run the site and remember your cookie choices. These don't need consent.

## Analytics (optional)

[Provider name] helps us understand which stories are read. Set only if you allow them.

## Advertising (optional)

[Ad partners] help fund our journalism. Set only if you allow them.

You can change your choices at any time using Cookie settings in the footer.$p$,'Which cookies FutureLens UK uses and how to control them under PECR.'),
('uk','terms','Terms of Use','legal',$p$[Insert terms of use for futurelens.co.uk. These terms are governed by the laws of England and Wales.]$p$,'Terms of use for futurelens.co.uk.'),
('uk','complaints','Complaints','legal',$p$We aim to correct errors quickly. To make a complaint about our journalism, email [complaints@futurelens.co.uk] with a link to the article and what you believe is wrong.

[If you join a press regulator such as IPSO or IMPRESS, add the details and escalation route here.]$p$,'How to complain about FutureLens UK coverage.');
