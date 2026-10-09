/* subjects/arts3367.js — ARTS3367 Philosophy of Mind and Psychology.
   In-class Test 1 (20%): 10 multiple-choice questions, then one mini-essay of
   up to 500 words chosen from three. Covers weeks 1–4:
     W1  Aristotle, the scientific revolution, Descartes, Elisabeth of Bohemia;
         Skinner and behaviourism; Smart's identity theory
     W2  Putnam, "The Nature of Mental States"; Searle and the Chinese Room
     W3  Davidson's anomalous monism; reduction; supervenience
     W4  Kim's causal exclusion argument; emergence; Yablo on proportionality
   The ten essay questions from the sample-question handout are included
   word for word and flagged as such; the rest are written to the same pattern.
   Essays are not auto-marked: you compare against a dot-point model answer
   and a checklist of the points a marker would look for. */
(function (global) {
  'use strict';

  /* ============================ topic primers ============================ */

  /* Shown behind the "Topic primer" toggle on every question in the topic. */
  var GUIDES = {
    dualism: {
      idea: 'Week 1. Aristotle saw diversity in nature, so each kind of thing has its own nature; a <b>soul</b> is the <b>form</b> of a living body — its parts and their organisation, which give it capacities like nutrition, perception, movement and reason. The scientific revolution replaced this with <b>uniformity</b>: one kind of material stuff whose nature is <b>extension</b>, so physics becomes maths and bodies become machines. Then where does the mind fit? Descartes answers with <b>substance dualism</b>; Elisabeth of Bohemia asks how a thinking thing with no extension could push or be pushed by matter — the problem of mental causation that runs through the whole course.',
      stepsTitle: 'Key claims',
      steps: [
        '<b>Aristotle:</b> living beings have specialised parts related in a fixed structure — their <b>form</b>. Plants: nutrition and growth. Animals add perception and moving under their own power (adjusting behaviour to what they perceive). Humans add <b>reason and speech</b>. These capacities are the soul — so plants have souls too.',
        'Consequences: souls cannot exist without bodies; souls have explanatory payoff; <b>materialism comes naturally</b> to this picture. Its problems (what are forms? paradoxes of matter — Ship of Theseus, Zeno’s arrow, Theon and Dion) are problems about matter in general, not specifically about the soul.',
        '<b>Scientific revolution</b> (16th–17th c.): one uniform substance whose nature is extension (taking up space); corollary — physics is maths. A cat is a material body whose movements seem to come from perceptions and desires — but what and where are these?',
        '<b>Ontology map:</b> dualism (a mental reality and a distinct material reality) vs monism — materialism (everything is material), idealism (everything is mental: Leibniz, Berkeley), neutral monism (neither: Spinoza, Russell). The course only engages dualism and materialism.',
        '<b>Descartes:</b> bodies are machines run by mechanical pushes and pulls; he tried mechanical explanations of sight, pain and volition. A <b>substance</b> is a kind of stuff or an individual thing; it has properties (modes, attributes), some <b>essential</b> (defining) and some <b>accidental</b> (optional).',
        'Why the gap? A complex mechanism might explain a cat, but reason, flexible language use, free will and consciousness seemed beyond any mechanism. That is where Descartes posits a non-mechanical mind.',
        '<b>Elisabeth of Bohemia:</b> our thinking causally influences, and is influenced by, material things; dualism is incomplete without an account of how. Pushing needs contact and extension, and the Cartesian mind has none — so it threatens to be a <b>ghost</b>: something that exists but cannot interact with anything physical.'
      ],
      workedTitle: 'The arguments, step by step',
      worked:
        '<div class="wq">Descartes’ argument for substance dualism</div>' +
        '<div class="step"><b>P1</b> My essence is thinking — nothing else belongs to my nature except that I am a thinking thing.</div>' +
        '<div class="step"><b>P2</b> The essence of a material body is extension — it is an extended, non-thinking thing.</div>' +
        '<div class="step"><b>P3</b> If x and y differ in their essence, they are different substances.</div>' +
        '<div class="step"><b>C</b> So I (a mind) am a distinct substance from any material body.</div>' +
        '<div class="wq" style="margin-top:14px">Elisabeth’s challenge</div>' +
        '<div class="step"><b>P1</b> The mind moves the body (I will, my arm rises) and the body affects the mind (injury, pain).</div>' +
        '<div class="step"><b>P2</b> In a mechanical world, bodies are moved only by contact and pushing, which requires extension.</div>' +
        '<div class="step"><b>P3</b> The Cartesian mind is unextended.</div>' +
        '<div class="step"><b>C</b> So either the mind cannot move the body (it is a ghost), or dualism owes us an account of how it can.</div>',
      trapsTitle: 'Common confusions',
      traps: [
        'Aristotle’s soul is not a ghostly extra ingredient — it is the form and organisation of a living body. That is why plants have one and why it cannot exist without the body.',
        'Descartes is a <i>substance</i> dualist: two kinds of thing, not just two kinds of property.',
        'Elisabeth does not deny that mind and body interact — she takes it as obvious and demands that dualism explain it.',
        'Idealism and neutral monism are <i>monisms</i>. Don’t file them under dualism.',
        '“Extension” means taking up space.'
      ]
    },

    behaviourism: {
      idea: 'Week 1. We ordinarily explain behaviour by citing thoughts, feelings, experiences and goals. An anti-dualist has two options: show that this psychological talk doesn’t commit us to non-physical things, or give it up (Occam’s razor). <b>Eliminative materialism</b> gives it up. <b>Behaviourism</b> (Skinner) and Smart’s identity theory both take the first route — behaviourism by reinterpreting mental talk as talk about behaviour and dispositions to behave.',
      stepsTitle: 'Key claims',
      steps: [
        'Skinner goes “meta”: the question “why do people behave as they do?” probably began as a practical one — how to anticipate and prepare for what another person will do.',
        '<b>Ontological commitment:</b> “there’s a burglar” commits us to a burglar existing. Reporting an after-image or a pain seems to commit us to something that is not a publicly observable physical object — what is it?',
        'The anti-dualist’s options: psychological ways of speaking either don’t commit us to non-physical stuff, or must be rejected. Skinner and Smart agree on the first route; <b>eliminativism</b> takes the second (reform our language — unlikely to happen).',
        'Least controversial premise of behaviourism: psychology can only be scientific if it concerns what can be publicly observed and measured. Lasting legacy: <b>operant conditioning</b> — you don’t get into the dog’s head; you shape the environment so actions are reinforced or extinguished. It is the basis of reinforcement learning in AI.',
        '<b>Methodological behaviourism:</b> psychological talk isn’t part of science, so set it aside. Treat the mind as a <b>black box</b>; science establishes reliable input/output correlations.',
        '<b>Radical/philosophical behaviourism:</b> reinterpret psychological concepts in terms of behaviour, or discard them as empty. “I like Brahms” → Brahms’ music reinforces me. Things are not reinforced because they are pleasing; they are <i>called</i> pleasing because they are reinforcing.',
        '<b>Mental states as dispositions:</b> a vase is fragile because it would break if struck — [subject] is [disposition] because [manifestation] if [manifestation condition]. “Jack is in pain” commits us to Jack being disposed to show pain behaviour. It can be true and explanatory, but not because pain is an inner cause of behaviour.',
        'Skinner thinks this cleans up a language contaminated by bad philosophy, religion and so on. Smart rejects it: pains and after-images are <b>inner causes</b> of behaviour.'
      ],
      workedTitle: 'One mental state, analysed',
      worked:
        '<div class="wq">“Sam wants ice cream”</div>' +
        '<div class="step"><b>Behaviourist:</b> Sam is disposed to go to the freezer, buy ice cream, say “I’d love an ice cream”, accept one if offered…</div>' +
        '<div class="step"><b>The snag:</b> Sam goes to the freezer only if she <i>believes</i> there is ice cream there, doesn’t <i>want</i> to keep her diet more, isn’t <i>embarrassed</i>… Every condition mentions another mental state, so the mental vocabulary never disappears (holism).</div>' +
        '<div class="step"><b>Functionalist (Week 2):</b> wanting ice cream is the inner state that is typically caused by heat, hunger or the sight of ice cream, that combines with beliefs to cause freezer-visiting, and that causes disappointment if there is none. Mentioning other mental states is allowed.</div>',
      trapsTitle: 'Common confusions',
      traps: [
        'Methodological behaviourism is a claim about scientific method (ignore the mind). Philosophical behaviourism is a claim about what mental terms mean (behaviour and dispositions). Don’t conflate them.',
        'Behaviourism <i>reinterprets</i> mental talk; eliminativism <i>abandons</i> it.',
        'A behaviourist disposition is not a hidden inner state that causes behaviour — that is exactly Smart’s view, which the behaviourist denies.',
        'Standard objections for essays: pretenders (pain behaviour without pain), stoics or paralysis (pain without behaviour), and holism (a desire produces behaviour only given beliefs and other desires).'
      ]
    },

    smart: {
      idea: 'Week 1. Smart’s identity theory: mental states such as pains and after-image experiences <b>are</b> brain processes — not correlated with them, not caused by them, identical to them. Pain is to C-fibre firing as lightning is to electrical discharge: an identity discovered empirically, not a definition. Why prefer it to dualism? <b>Occam’s razor</b>: dualism needs extra non-physical states and odd psychophysical laws to explain the same facts that physics alone can explain.',
      stepsTitle: 'Key claims',
      steps: [
        'Smart rejects behaviourism: being in pain or seeing an after-image are <b>inner causes</b> of behaviour.',
        'Jack’s causal chain: foot injured → nerve signal → <b>C-fibres fire</b> → brain signals chest and throat → Jack cries out. The dualist inserts <b>psychophysical laws</b>: C-fibres fire → (non-physical) pain → signal. Smart: science may explain the whole thing some day, and it will still be an entirely physical chain.',
        '<b>Occam’s razor:</b> choose the simplest explanation, requiring the fewest assumptions. Psychological talk either doesn’t commit us to non-physical stuff or should be rejected — and Smart interprets it so that it doesn’t.',
        '“I am in pain” = I am announcing that I am in a certain neurological state. “Jack cries out because he is in pain” and “because his C-fibres are firing” are the same explanation in different words.',
        'It is not the theory that pain is <i>correlated with</i> or <i>caused by</i> C-fibre firing, but that pain <b>is</b> C-fibre firing.',
        '<b>Identity</b> is the relation everything has to itself and to no other thing: Clark Kent is Superman — one thing, not two. <b>Leibniz’s law:</b> if x is y, whatever is true of x is true of y, and vice versa.',
        'Property identities (“for something to be F is for it to be G”) can be definitions known a priori, or empirical discoveries. Smart’s are <b>empirical</b>, like water = H₂O — so you can be competent with “pain” without knowing any neurophysiology.',
        'The theory is <b>reductive</b> and a <b>type</b> identity theory: each kind of mental state is a kind of brain state.'
      ],
      workedTitle: 'Smart’s argument against dualism',
      worked:
        '<div class="step"><b>P1</b> Everything about Jack’s cry — injury, nerves, brain, throat — can in principle be explained physically.</div>' +
        '<div class="step"><b>P2</b> Dualism explains the same facts only by adding non-physical pains plus psychophysical laws linking them to brain states — laws unlike anything else in science.</div>' +
        '<div class="step"><b>P3</b> No experiment separates the two views: every pain–brain correlation the identity theorist cites, the dualist explains with a psychophysical law.</div>' +
        '<div class="step"><b>P4</b> Occam’s razor: if two theories fit the evidence equally, prefer the one with fewer entities and laws.</div>' +
        '<div class="step"><b>C</b> So prefer the identity theory — provided no cogent argument forces dualism, which is why Smart answers the objections one by one.</div>',
      trapsTitle: 'Common confusions',
      traps: [
        'Identity ≠ correlation ≠ causation. “C-fibre firing causes pain” is something a dualist can say.',
        'The specific identities (pain = C-fibre firing) are empirical; the choice between dualism and identity theory is made by simplicity, since both fit the same data.',
        '“‘Pain’ means C-fibre firing” is not Smart’s view — he denies the identity is a definition.',
        'Smart is a <i>type</i> identity theorist. Contrast Davidson’s <i>token</i> identity.',
        '“Lightning is electrical discharge” is slightly misleading: most discharges aren’t lightning, and the “is” can be read as predication. The identity is with a <i>specific kind</i> of discharge.'
      ]
    },

    functionalism: {
      idea: 'Week 2 (Putnam, “The Nature of Mental States”). Putnam compares three answers to “what is pain?”: a brain state (Smart), a behaviour disposition (behaviourism), or a <b>functional state</b> of the whole organism. He backs the third: to be in pain is to be in a state with a certain <b>causal role</b> — caused by certain inputs, producing certain outputs, interacting with other internal states — given by the organism’s functional organisation, like a machine table. His key argument against the identity theory is <b>multiple realisability</b>: mammals, octopuses, perhaps aliens or machines can all be in pain, but there is surely no single physico-chemical state they all share.',
      stepsTitle: 'Key claims',
      steps: [
        'Putnam treats “is pain a brain state?” as an empirical question about which hypothesis is most plausible.',
        '<b>Functional-state hypothesis:</b> being in pain is being in a state of the organism’s functional organisation, specified by its relations to sensory inputs, behavioural outputs and other internal states (a “Description” of the organism as a probabilistic automaton — a kind of Turing machine).',
        '<b>Multiple realisability:</b> one functional state can be realised by very different physical states, as one program can run on different hardware.',
        'Against the brain-state hypothesis: the identity theorist needs a physico-chemical state present in <i>every</i> pain-capable creature — mammals, reptiles, molluscs (octopus), perhaps extraterrestrials. Putnam calls this “ambitious” and highly implausible. One psychological predicate that applies to a mammal and an octopus with different physical correlates and the brain-state theory collapses.',
        'Against behaviourism: mental states are inner states that cause behaviour and interact with one another; behaviour is evidence of them, not what they are. A functional definition may mention other mental states, so the holism that sinks behaviourism is no problem.',
        'Functional (computational) states are <b>higher-level</b> states — so functionalism is less reductive than Smart’s view, and could recognise pain in an octopus.',
        'Putnam notes the functional-state hypothesis is <b>not incompatible with dualism</b>: a soul could in principle realise a functional organisation. In practice functionalists are physicalists about the realisers.'
      ],
      workedTitle: 'The multiple realisability argument',
      worked:
        '<div class="step"><b>P1</b> Type identity: pain = C-fibre firing, so anything in pain has firing C-fibres (by Leibniz’s law).</div>' +
        '<div class="step"><b>P2</b> Octopuses (and possibly aliens or machines) can be in pain.</div>' +
        '<div class="step"><b>P3</b> Their physical make-up is very different — no C-fibres, or no neurons at all.</div>' +
        '<div class="step"><b>C</b> So pain is not C-fibre firing. What all pains share is a causal role, not a physical type.</div>' +
        '<div class="step"><b>Replies open to Smart:</b> species-specific (“local”) identities — pain-in-humans = C-fibre firing; a disjunctive identity; or “let neuroscience decide” — at the right grain, realisers may be more similar than Putnam assumes.</div>',
      trapsTitle: 'Common confusions',
      traps: [
        'Multiple realisability is an argument against <i>type</i> identity, not against materialism — every realiser can still be physical (token physicalism).',
        'Functionalism defines states by what they <i>do</i>, not what they are made of.',
        'Putnam doesn’t prove octopuses feel pain. The point is that it is implausible that every pain-capable creature shares one physico-chemical state.',
        'Functional states are inner causes, and may be defined by reference to other mental states — that is the key difference from behaviourism.'
      ]
    },

    searle: {
      idea: 'Week 2 (Searle). Searle targets <b>strong AI</b>: the claim that an appropriately programmed computer literally has a mind, so that running the right program is sufficient for understanding. In the <b>Chinese Room</b>, Searle (who knows no Chinese) follows an English rulebook for manipulating Chinese symbols and produces answers indistinguishable from a native speaker’s. He implements the program, yet understands nothing. Programs are purely formal (<b>syntax</b>); understanding requires meaning (<b>semantics</b>); syntax by itself is not sufficient for semantics. So no program is by itself sufficient for a mind.',
      stepsTitle: 'Key claims',
      steps: [
        '<b>Strong AI</b>: an appropriately programmed computer really is a mind — it literally understands. <b>Weak AI</b>: computers are powerful tools for studying and simulating minds. Searle attacks only strong AI.',
        'The room passes a Turing-style test for Chinese, but the man inside manipulates symbols purely by their shapes and understands nothing.',
        'The argument: (1) programs are formal (syntactic); (2) minds have mental contents (semantics); (3) syntax by itself is neither constitutive of nor sufficient for semantics; so (4) programs are neither constitutive of nor sufficient for minds.',
        '<b>Brains cause minds.</b> Anything else that thinks must have causal powers at least equivalent to the brain’s, and it cannot get them just by running a program.',
        '<b>Simulation is not duplication:</b> a computer simulation of a rainstorm leaves nobody wet; a simulation of digestion digests nothing.',
        'Searle does <i>not</i> say machines can’t think — we are biological machines that do. His claim is that nothing thinks <i>solely in virtue of</i> running a program.',
        'It is also an objection to functionalism: the room can have the right functional/computational organisation without understanding.'
      ],
      workedTitle: 'The replies and Searle’s answers',
      worked:
        '<div class="step"><b>Systems reply</b> — the man doesn’t understand, but the whole system (man, rulebook, paper) does. <i>Searle:</i> let the man memorise the rules and work in his head; now he is the whole system and still understands nothing.</div>' +
        '<div class="step"><b>Robot reply</b> — put the program in a robot with cameras and arms so symbols connect to the world. <i>Searle:</i> the camera input just arrives as more uninterpreted symbols.</div>' +
        '<div class="step"><b>Brain simulator reply</b> — simulate the neuron firings of a Chinese speaker. <i>Searle:</i> run the same formal structure on water pipes and valves; still no understanding. Simulating the formal structure misses the brain’s causal powers.</div>' +
        '<div class="step"><b>Other minds reply</b> — we only know others understand by their behaviour. <i>Searle:</i> the question is what understanding is, not how we know about it.</div>',
      trapsTitle: 'Common confusions',
      traps: [
        'The conclusion is about programs, not machines. “Computers cannot think” overstates it.',
        'The thought experiment alone shows only that the man doesn’t understand. To reach the conclusion Searle also needs: the man is relevantly like any computer running any program; the system doesn’t understand either; and syntax isn’t sufficient for semantics.',
        'Weak AI is untouched by the argument.',
        'For Searle, passing the Turing test is not sufficient for understanding.'
      ]
    },

    davidson: {
      idea: 'Week 3 (Davidson, “Mental Events”). Davidson wants to keep three claims that look inconsistent: (1) mental events causally interact with physical events; (2) events related as cause and effect fall under strict laws; (3) there are no strict psychological or psychophysical laws. His solution, <b>anomalous monism</b>: every mental event is identical to some physical event (token identity), so it can cause and be caused under strict physical laws. But mental <i>properties</i> are not physical properties (no type identity), so we shouldn’t expect psychophysical laws. “Monism”: every event is physical. “Anomalous”: the mental is not governed by laws.',
      stepsTitle: 'Key claims',
      steps: [
        '<b>Laws of nature</b> (nomological laws) are general, exceptionless, support inductive reasoning, and are descriptive. Candidates for laws are “law-like”. <b>Human laws</b> are normative — they say what you should do.',
        'Psychological explanation is not law-based. <b>Propositional attitudes</b> (believe, know, hope, intend, desire, fear… <i>that p</i>) have content; <b>intentionality</b> is the property of having content. <b>Reasons</b> fix what you should believe, want or do.',
        'We attribute to people what makes rational sense given what else we take them to believe and want, and if they act, they act on what makes rational sense. According to Davidson this is not optional. Even someone acting against their own best judgement acts for a reason.',
        'Rationality is <b>normative</b>: believing in accordance with your evidence is what you <i>should</i> do, not a law. People violate rational norms all the time — a reason to doubt the mind reduces to physical terms. (A reductionist would say psychological explanation is a shortcut for neurochemistry we don’t know.)',
        'Events can be described in many ways: one event can be described as a neural activation pattern and as a belief that the sky is blue.',
        '<b>Token identity</b> (every coloured thing is a shaped thing) vs <b>type identity</b> (every colour property is a shape property). Davidson accepts token identity and rejects type identity: what makes a belief that the sky is blue is its rational role, not any neural pattern. There is no pattern everyone, or one person at different times, must share. (This is falsifiable — ML “thought decoding” results so far are limited.)',
        'Solution: mental events causally interact with physical events because each mental event is a physical event; mental properties aren’t physical properties, so there are no psychophysical laws. Mental and physical properties belong to different families — not identical, not even coextensive.',
        '<b>Supervenience:</b> mental characteristics depend on physical ones — no mental difference without a physical difference — but this does not mean the mental can be reduced by law or definition.'
      ],
      workedTitle: 'The paradox and its resolution',
      worked:
        '<div class="step"><b>1. Causal interaction</b> — Sally’s belief that the marble is in the basket causes her hand to reach into the basket.</div>' +
        '<div class="step"><b>2. Nomological character of causality</b> — if two events are cause and effect, they fall under a strict law.</div>' +
        '<div class="step"><b>3. Anomalism of the mental</b> — there is no strict law linking “belief that the marble is in the basket” with any physical type.</div>' +
        '<div class="step"><b>Resolution</b> — laws relate events <i>under descriptions</i>. Sally’s belief is a neural event N; under the description “N” it falls under strict physical laws, which is how it causes the reaching. Under the description “belief that…” it is answerable to rational norms, not laws. One event, two descriptions: token identity without type identity.</div>',
      trapsTitle: 'Common confusions',
      traps: [
        'Anomalous monism is a <i>monism</i>: mental events ARE physical events. “No psychophysical laws” doesn’t make the mental non-physical.',
        'Davidson denies <i>strict</i> laws involving mental terms. Rough “other things equal” generalisations are fine.',
        'Token vs type: one event with two descriptions vs one property with two names.',
        'Irrationality doesn’t refute Davidson. Rational norms are norms, not laws, and their violation is part of why the mental isn’t lawlike.',
        'The standard objection (Kim and others): if events cause only in virtue of their physical properties, mental properties look causally idle.'
      ]
    },

    supervenience: {
      idea: 'Weeks 3–4. Not everything that exists is equally fundamental: societies depend on people, people on cells, cells on atoms. <b>Reductive</b> materialists say higher levels are fully explained by lower ones (temperature is molecular energy, water is H₂O, pain is C-fibre firing). <b>Non-reductive</b> materialists say mental phenomena are physical but can’t be fully reductively explained — chiefly because of <b>consciousness</b> and <b>reason</b>. Their key tool is <b>supervenience</b>: no mental difference without a physical difference. It allows multiple realisability and gives materialism without reduction — but it states a correlation, not why it holds. <b>Emergence</b> asks whether higher levels can be genuinely new.',
      stepsTitle: 'Key claims',
      steps: [
        '<b>Reductive explanation</b> explains what something is in terms of the more fundamental stuff it is made of (life is a complex set of biochemical reactions). Many feel something is lost — the same reaction people have to materialism about the mind.',
        'Smart’s identity theory is reductive; functionalism less so (higher-level computational states); Davidson is non-reductive.',
        '<b>Non-reductive materialism:</b> mental phenomena are physical, but cannot be fully reductively explained in physical (neuroscientific) terms. Two main reasons: consciousness (there is something it is like to be you, nothing it is like to be an electron) and reason (to explain a cat’s behaviour you cite aims, beliefs and perceptions, not physics).',
        '<b>Supervenience:</b> A supervenes on B iff there can be no A-difference without a B-difference. Exact physical duplicates would be exact mental duplicates — often treated as the <b>minimal commitment of materialism</b>.',
        'Examples: inflation supervenes on the decisions of millions; gas temperature on molecular energy; a machine’s computational state on the physical state of its components; a mosaic’s picture on the tiles.',
        'Supervenience allows <b>multiple realisability</b> (many tile configurations, one mosaic) and is <b>asymmetric</b>: A can supervene on B without B supervening on A.',
        '<b>Layer cake:</b> particle physics at the bottom; planets, organisms, corporations higher up. Reductivism: the higher levels are fully explained by the lower — in a sense only the bottom layer is real. Non-reductivism: some higher layers are real and distinct, though not unrelated. Fix the physical facts and the mental follow, but not vice versa.',
        '<b>Emergence:</b> complex systems display properties novel relative to their parts (locust swarms; capabilities of combined artificial neurons). <b>Weak</b> emergence is epistemological — unpredictable only because of our cognitive limits (uncontroversial). <b>Strong</b> emergence is metaphysical — genuinely new, with real causal powers (highly controversial). Kim thinks it incoherent; others think it’s everywhere (life, consciousness).'
      ],
      workedTitle: 'Supervenience and zombies',
      worked:
        '<div class="step"><b>Zombie</b> — a being physically identical to you with no experience at all.</div>' +
        '<div class="step"><b>If zombies are genuinely possible</b>, two beings differ mentally without differing physically, so the mental does not supervene on the physical and materialism is false.</div>' +
        '<div class="step"><b>Materialist reply 1</b> — zombies are conceivable but not possible, like “water that isn’t H₂O”: conceivability doesn’t settle what is possible for a posteriori identities.</div>' +
        '<div class="step"><b>Materialist reply 2</b> — notice the modal strength. If the mental supervened only by the laws of nature, zombies would be possible under other laws, which a property dualist can accept. Materialism needs supervenience that holds of necessity.</div>',
      trapsTitle: 'Common confusions',
      traps: [
        'Direction: the mental supervenes <i>on</i> the physical. Many physical states can realise one mental state, not vice versa.',
        'Supervenience is necessary for materialism but arguably not sufficient: it gives a correlation, not a reason why — a dualist with necessary psychophysical laws could accept it.',
        'Weak emergence is compatible with reduction; strong emergence is not.',
        'Non-reductive is not dualist: the non-reductivist still holds every concrete particular is physical.'
      ]
    },

    kim: {
      idea: 'Week 4 (Kim). Materialists long assumed mental causation was a problem only for dualists (Elisabeth’s challenge). Kim argues non-reductive materialists face it too. If a mental property M is distinct from its physical realiser P, and P is already a sufficient physical cause of the behaviour (<b>causal closure</b>), then M has no work left to do — unless the behaviour is <b>overdetermined</b>, which is implausible as a general rule. So either M is reduced to P, or M is causally idle. Only reductive materialism can make sense of the causal powers of the mind.',
      stepsTitle: 'Key claims',
      steps: [
        'Mental causation runs through the course: Elisabeth’s challenge to Descartes; the basis of Smart’s identity theory; the basis of Davidson’s argument; functionalists identify mental properties by their causal roles.',
        '<b>Causal closure of the physical</b> (Kim): every physical event that has a sufficient cause has a sufficient physical cause. It allows physical events that just happen, but tracing back a physical event’s causal history we never need to appeal to anything non-physical. Kim treats it as a core commitment of any materialist metaphysics. (Older cousins: “nothing comes from nothing”; Descartes used a causal principle to argue for God.)',
        'Closure works like Occam’s razor: if the physical world is causally closed, what need is there for non-physical causes?',
        'A <b>sufficient cause</b> is enough to guarantee its effect. <b>Overdetermination</b> is an effect having more than one sufficient cause. Too many causes is a problem: if one does the work, there seems to be no work left for the other.',
        'Kim takes non-reductive physicalists to be committed to mental properties having <b>novel causal powers</b> — i.e. being <b>strongly emergent</b> — and argues strong emergence is not compatible with causal closure.',
        '<b>Fodor:</b> if mental causation isn’t real, practically everything we believe about anything is false — “the end of the world”.',
        '<b>Generalisation worry:</b> Kim’s argument threatens not just mental causation but every causal claim of common sense and of every science except fundamental physics.',
        'Open questions: what counts as “physical” (Kim seems to mean fundamental physics)? What counts as a “sufficient cause”?'
      ],
      workedTitle: 'The exclusion argument',
      worked:
        '<div class="wq">A desire for water (D) is realised by neural state N; the arm reaches for a glass (R).</div>' +
        '<div class="step"><b>1. Mental causation</b> — D causes R.</div>' +
        '<div class="step"><b>2. Irreducibility</b> — D is not identical to N (non-reductivism).</div>' +
        '<div class="step"><b>3. Closure</b> — R, a physical event, has a sufficient physical cause: N.</div>' +
        '<div class="step"><b>4. Exclusion</b> — no event has more than one sufficient cause, unless it is genuinely overdetermined.</div>' +
        '<div class="step"><b>5. No systematic overdetermination</b> — not every action is caused twice over.</div>' +
        '<div class="step"><b>C</b> — N excludes D. So either D = N (reduction) or D is epiphenomenal.</div>',
      trapsTitle: 'Common confusions',
      traps: [
        'Kim’s conclusion isn’t “mental causation is unreal” — it’s that non-reductive physicalism can’t have it, while reductive physicalism can.',
        'Closure doesn’t say every physical event has a cause — only that those with sufficient causes have sufficient physical ones.',
        'Overdetermination isn’t contradictory; <i>systematic</i> overdetermination is rejected as implausible.',
        'Core commitments of non-reductive physicalism: all concrete particulars are physical (yes); mental properties are real and irreducible (yes); every mental property is realised by physical mechanisms (yes); every mental property is identical to a physical property (no); mental phenomena have novel causal powers (no — though Kim argues NRP is stuck with it).'
      ]
    },

    yablo: {
      idea: 'Week 4 (Yablo). Yablo defends non-reductive materialism against Kim. Some properties are <b>determinables</b> of others: being scarlet is a specific way — a <b>determinate</b> — of being red. Determinables and their determinates don’t compete for causal relevance. Yablo proposes that mental properties stand to their neural realisers as red stands to scarlet. And causes should be <b>proportional</b> to their effects: specific enough, but not too specific. Often it is the mental property, not its realiser, that is the proportional cause of behaviour.',
      stepsTitle: 'Key claims',
      steps: [
        'Macrophysical properties and their realisers do not compete for causal relevance: the brick and its particles don’t both break the window in a troubling way.',
        'A determinable can be had in different ways — its determinates: colour → red → scarlet, from less to more determinate.',
        'Determinates can be too specific to answer a causal question; determinables can be too unspecific.',
        '<b>Proportionality:</b> to pick out the cause of an effect, look for something neither too unspecific nor too specific — it includes what the effect requires and nothing extra.',
        '<b>Sophie the pigeon</b> is trained to peck at red. Shown a scarlet chip, she pecks. The chip’s redness is the cause: she would have pecked at any red chip, so scarlet adds detail that made no difference; “coloured” would be too unspecific.',
        'Mental properties and their neural realisers stand as red to scarlet: your brain state while in pain is a determinate of the determinable being in pain. Pain seems more proportionate to the behavioural effect than any of its realisers.',
        'The claim is not that we prefer mental answers, but about what the causes really are: proportionality is meant as a <b>metaphysical</b>, not an epistemological, constraint.',
        'Open questions: is determinable/determinate the right model for mental/physical? If not, what happens to the defence? Is proportionality a constraint on causation, or only on our understanding?'
      ],
      workedTitle: 'Sophie, step by step',
      worked:
        '<div class="step"><b>Too unspecific:</b> the chip is coloured. She wouldn’t peck at blue, so “coloured” isn’t enough.</div>' +
        '<div class="step"><b>Proportional:</b> the chip is red. Remove the redness and she doesn’t peck; any red will do.</div>' +
        '<div class="step"><b>Too specific:</b> the chip is scarlet. Had it been crimson she’d still have pecked, so the scarlet-ness made no extra difference.</div>' +
        '<div class="step"><b>The mental parallel:</b> Jack would have cried out however his pain was neurally realised (N₁, N₂, …), so “being in pain” is proportional to the cry, while “N₁” carries irrelevant detail. The mental property isn’t excluded; if anything it is the better cause.</div>',
      trapsTitle: 'Common confusions',
      traps: [
        'Yablo doesn’t prefer mental explanations because they are easier. Proportionality is meant to be metaphysical.',
        'Proportionality cuts both ways: describe the effect very finely (an exact neural motor pattern) and the realiser may be the proportional cause.',
        'For the analogy to work, determinates must necessitate their determinable (anything scarlet must be red), so neural realisers must necessitate the mental property. Determinates of one determinable also vary along shared dimensions (hue, saturation) — is that true of neural states and pains?',
        'Yablo’s move denies that determinable and determinate are <i>competing</i> sufficient causes, so the case isn’t overdetermination at all.'
      ]
    }
  };

  var TOPICS = [
    { key: 'dualism',       name: 'Dualism',                    week: 1 },
    { key: 'behaviourism',  name: 'Behaviourism',               week: 1 },
    { key: 'smart',         name: 'Identity theory',            week: 1 },
    { key: 'functionalism', name: 'Functionalism',              week: 2 },
    { key: 'searle',        name: 'Chinese Room',               week: 2 },
    { key: 'davidson',      name: 'Anomalous monism',           week: 3 },
    { key: 'supervenience', name: 'Supervenience & emergence',  week: 3 },
    { key: 'kim',           name: 'Causal exclusion',           week: 4 },
    { key: 'yablo',         name: 'Proportionality',            week: 4 }
  ];

  /* =========================== multiple choice ============================
     o[0] is always the correct answer; options are shuffled when built.
     `why` explains the answer and names the trap in the best distractor. */

  var MCQ = {
    dualism: [
      { q: 'According to Aristotle, what is the soul of a living thing?',
        o: ['Its form — the organisation of its parts that gives it capacities like nutrition, perception and movement',
            'An immaterial thinking substance, joined to the body, that can survive the death of the body',
            'The fine matter (animal spirits) flowing through the nerves that moves the limbs mechanically',
            'The faculty of reason and speech, which is what separates humans from plants and other animals'],
        why: 'For Aristotle the soul is the <b>form</b> of a living body — parts plus organisation — which grounds its life-capacities. An immaterial thinking substance is Descartes’ mind. Reason and speech are only the highest level of soul; plants and animals have souls too.' },
      { q: 'Which of the following follows from Aristotle’s conception of the soul?',
        o: ['Plants have souls, and a soul cannot exist without a body',
            'Only humans have souls, since only humans are capable of reason and speech',
            'Animals are soulless machines whose movements are explained by pushes and pulls',
            'The soul is a separate substance that can survive the destruction of the body'],
        why: 'If the soul is the form of any living body, every living thing — plants included — has one, and a form cannot exist apart from what it is the form of. Animals-as-machines and the separable soul are Descartes.' },
      { q: 'In Aristotle’s hierarchy of souls, what do humans add to the capacities of other animals?',
        o: ['Reason and speech', 'Perception and self-movement', 'Nutrition and growth', 'A body with specialised parts in a fixed structure'],
        why: 'Plants: nutrition and growth. Animals add perception and moving under their own power. Humans add <b>reason and speech</b>. Specialised parts belong to every living being.' },
      { q: 'What view of matter did the 16th–17th century scientific revolution put in place of Aristotle’s diversity of natures?',
        o: ['There is one uniform material substance, whose nature is extension, so physics is maths',
            'Each natural kind has its own form, so each needs its own science with its own methods',
            'Matter is an illusion: only minds and their ideas exist, so physics studies appearances',
            'Matter is irreducibly diverse, so no single mathematical physics can describe all of it'],
        why: '<b>Uniformity</b>: one kind of stuff whose nature is extension (taking up space), with the corollary that physics is maths. Diverse natures is the Aristotelian view being replaced; “matter is an illusion” is idealism.' },
      { q: 'According to Descartes, what is the essence of material bodies?',
        o: ['Extension — taking up space', 'Life — the capacity for nutrition and growth', 'Thought — the capacity to doubt, will and perceive', 'Motion — the capacity to move under its own power'],
        why: 'Body’s essence is <b>extension</b>; mind’s essence is thought. Nutrition and growth is Aristotle’s lowest level of soul.' },
      { q: 'Which argument best captures why Descartes is a substance dualist?',
        o: ['My essence is thinking and body’s is extension; differing essences mean different substances',
            'Minds and bodies are perfectly correlated but never interact, so they must be two substances',
            'Science cannot explain consciousness in mechanical terms, so the mind must be non-physical',
            'The mind is the form of the body, so it is a different kind of thing from the body’s matter'],
        why: 'This is the essence argument from the lecture. “Science can’t explain it” is an argument from ignorance, not Descartes’. “Form of the body” is Aristotle’s view, which implies the soul can’t exist without the body.' },
      { q: 'Princess Elisabeth of Bohemia’s central objection to Descartes concerned:',
        o: ['how an unextended thinking substance could move the body or be affected by it',
            'whether Descartes had proved God exists, without which dualism has no foundation',
            'why, if the mind is extended, no one has ever observed a mind in the world',
            'whether animals think, given that Descartes treated them as mere machines'],
        why: 'The <b>interaction problem</b>: in a mechanical world bodies move by contact and pushing, which needs extension, and the mind has none. Elisabeth grants that thought and matter interact — she demands that dualism explain how.' },
      { q: 'Which best describes the “ghost” worry about Cartesian dualism?',
        o: ['The mind seems to exist yet be unable to causally interact with anything physical',
            'The body seems to be an illusion — a ghostly projection produced by the mind',
            'The mind seems to be a machine haunted by ghostly, non-physical brain processes',
            'The mind seems to sit in the pineal gland, which would make it physical after all'],
        why: 'From the lecture: the Cartesian mind looks like a ghost — it exists but cannot causally interact with anything physical. That is why Elisabeth’s challenge bites.' },
      { q: 'Which view holds that reality is ultimately neither mental nor physical?',
        o: ['Neutral monism', 'Idealism', 'Substance dualism', 'Eliminative materialism'],
        why: '<b>Neutral monism</b> (Spinoza, Russell). Idealism says everything is mental (Leibniz, Berkeley). Dualism says there are two realities.' },
      { q: 'Idealism, as distinguished in lectures, is the view that:',
        o: ['Everything that exists is mental', 'Everything that exists is material', 'Mental reality and material reality are distinct', 'Mental states are ideal patterns of behaviour'],
        why: 'Idealism is a <b>monism</b>: everything is mental (Leibniz, Berkeley). “Everything is material” is materialism; “distinct realities” is dualism.' },
      { q: 'Why did the mechanical picture of nature make the place of the mind a problem?',
        o: ['If matter is just extended stuff moved by pushes, what and where are perceptions and desires?',
            'Mechanics showed the brain plays no role in producing behaviour, so the mind must do it all',
            'Mechanics implied that all living things, plants included, must have minds of their own',
            'Mechanics proved that minds are made of a special kind of extended matter in the nerves'],
        why: 'The cat example: a cat is a material body whose movements seem to come from perceptions and desires — but in a world of extended stuff, what and where are these?' },
      { q: 'Descartes thought a complex enough mechanism could explain a cat’s behaviour. Why did he think humans need something more?',
        o: ['Reason, flexible use of language and free will seemed beyond any mechanism',
            'Humans, unlike cats, have nerves that transmit signals mechanically to the muscles',
            'Cats are made of a different material substance from humans, one without extension',
            'Human behaviour is too unpredictable to be explained, since humans have more parts'],
        why: 'The “gaps”: reason, language, free will and consciousness are where mechanistic explanation seemed to fall short. Animals could be complex automata; humans could not. That is why Descartes posits a non-mechanical mind.' },
      { q: 'In Descartes’ terminology, an <i>essential</i> property of a substance is one that:',
        o: ['Defines what kind of substance it is, so the substance cannot be without it',
            'Is optional — the substance could lack it and still be the same kind of thing',
            'Can be perceived by the senses, unlike the hidden properties of a substance',
            'Is shared by every substance, whether mental or material, as part of being real'],
        why: 'Essential properties define the substance; <b>accidental</b> properties are optional. Thinking is essential to mind, extension to body.' }
    ],

    behaviourism: [
      { q: 'Methodological behaviourism holds that:',
        o: ['Psychology should treat the mind as a black box and study input–output correlations',
            'Mental terms mean the same as statements about behaviour and dispositions to behave',
            'Mental states are brain states, which psychology can study by measuring behaviour',
            'Mental states are functional states, defined by their causal roles within an organism'],
        why: 'Methodological behaviourism is a claim about <b>scientific method</b>: psychological talk isn’t part of science, so treat the mind as a black box. The claim about what mental terms <i>mean</i> is philosophical behaviourism.' },
      { q: 'Radical (philosophical) behaviourism holds that:',
        o: ['Mental concepts should be reinterpreted in terms of behaviour and dispositions, or discarded',
            'Psychology may study only observable behaviour, whatever minds may turn out to be',
            'Psychological states are unobservable inner causes, inferred from observed behaviour',
            'Psychological talk is literally false and should be eliminated from everyday language'],
        why: 'It <b>reinterprets</b> (or discards) mental concepts. Studying only behaviour, whatever minds are, is methodological behaviourism; eliminating mental talk is eliminativism; inner causes is Smart.' },
      { q: 'Skinner reinterprets “I like Brahms” as:',
        o: ['The music of Brahms reinforces me',
            'I am in a brain state that represents Brahms as pleasant',
            'I have an inner feeling of pleasure when I hear Brahms',
            'Hearing Brahms causes me to believe his music is good'],
        why: 'Liking is cashed out as <b>reinforcement</b> — a behavioural relation, not an inner feeling or brain state.' },
      { q: '“Things are not reinforced because they are pleasing; they are called pleasing because they are reinforced.” What is this slogan meant to show?',
        o: ['Calling something “pleasing” needn’t refer to an inner feeling — it marks what reinforces',
            'Pleasure is an inner feeling that causes reinforcement, so it must be studied directly',
            'Reinforcement cannot occur unless the organism consciously experiences some pleasure',
            'Whether something is pleasing is fixed by its effects on the brain’s reward circuitry'],
        why: 'It reverses the usual order of explanation: “pleasing” is a label for what reinforces, so it carries no commitment to an inner feeling.' },
      { q: 'On the behaviourist analysis, “Jack is in pain” is true because:',
        o: ['Jack is disposed to wince, cry out and nurse the injury in suitable circumstances',
            'Jack’s C-fibres are firing, and C-fibre firing is the inner cause of his wincing',
            'Jack has an inner sensation which, though unobservable, causes his pain behaviour',
            'Jack is in an internal state, caused by tissue damage, that causes him to avoid it'],
        why: 'Pain is a behavioural <b>disposition</b>. The statement is true and explanatory, but not because pain is an inner cause — inner causes are Smart (C-fibres) or the functionalist (an internal state with a causal role).' },
      { q: 'Using the schema “[subject] is [disposition] because [manifestation] if [manifestation condition]”, what is the <i>manifestation</i> of a vase’s fragility?',
        o: ['Breaking', 'Being struck', 'The molecular structure of the glass', 'Being dropped by someone careless'],
        why: 'A vase is fragile because it would <b>break</b> (manifestation) if <b>struck</b> (manifestation condition). Molecular structure is the categorical basis — not part of the behaviourist schema.' },
      { q: 'What distinguishes eliminative materialism from behaviourism?',
        o: ['Eliminativism abandons psychological talk; behaviourism reinterprets it as talk of behaviour',
            'Eliminativism says the mind is the brain; behaviourism says the mind is outward behaviour',
            'Eliminativism is a form of dualism; behaviourism is a form of materialism about the mind',
            'Eliminativism accepts inner mental causes of behaviour; behaviourism denies there are any'],
        why: 'Eliminativism: reform our language so we don’t talk of such things. Behaviourism keeps the talk but reinterprets it. Both are materialist.' },
      { q: 'What is generally seen as behaviourism’s most lasting legacy?',
        o: ['Operant conditioning, which underlies reinforcement learning in AI',
            'The discovery that mental states are identical to states of the brain',
            'The topic-neutral analysis of how we report our sensations',
            'The argument that syntax alone is not sufficient for semantics'],
        why: 'You don’t need to get into the dog’s head to train it — shape the environment. That is operant conditioning, the basis of reinforcement learning.' },
      { q: 'Which is the “least controversial premise” of behaviourism?',
        o: ['Psychology can only be scientific if it studies what is publicly observable',
            'Mental states such as beliefs and pains do not really exist at all',
            'All mental vocabulary is meaningless unless it can be verified by introspection',
            'Every mental state is identical to some disposition to behave in certain ways'],
        why: 'The publicity requirement is widely accepted. The other options are much stronger, contested claims.' },
      { q: 'Why does Smart reject behaviourism?',
        o: ['Pains and after-images are inner causes of behaviour, not mere dispositions',
            'Mental states are non-physical, so they cannot be identical to behaviour',
            'Psychology is autonomous, so mental states can’t be analysed in other terms',
            'Behaviour cannot be publicly observed, so it can’t ground a scientific psychology'],
        why: 'For Smart, pain is an <b>inner cause</b> — a brain process — of the cry. The behaviourist denies pain is an inner cause at all.' },
      { q: 'A person who wants ice cream goes to the freezer only if she believes there is ice cream there and doesn’t more strongly want to stick to her diet. Which problem does this raise for philosophical behaviourism?',
        o: ['The disposition can’t be specified without mentioning other mental states',
            'Desires are private, so scientists can never observe them in other people',
            'Desires are identical to brain states, so they can’t be identical to behaviour',
            'Desires turn out to have no effect on behaviour, so they are explanatorily idle'],
        why: '<b>Holism</b>: a desire only issues in behaviour given beliefs and other desires. Each condition is mental, so the analysis is circular or regresses. Functionalism welcomes this; behaviourism can’t.' },
      { q: 'An actor convincingly fakes pain without feeling any; a stoic feels intense pain but suppresses all pain behaviour. These cases are standard objections to:',
        o: ['Philosophical behaviourism, since pain and pain behaviour can come apart',
            'The identity theory, since the actor’s C-fibres are not firing while he acts',
            'Functionalism, since the actor has exactly the functional organisation of pain',
            'Methodological behaviourism, since it denies scientists can observe behaviour'],
        why: 'If pain just is a disposition to pain behaviour, there should be no pain without the disposition and no disposition without pain. The actor and the stoic suggest otherwise.' }
    ],

    smart: [
      { q: 'According to Smart’s identity theory, how is pain related to C-fibre firing?',
        o: ['Identity: being in pain is C-fibres firing',
            'Correlation: pain always occurs with C-fibre firing',
            'Causation: C-fibre firing causes the feeling of pain',
            'Supervenience: pain depends on C-fibre firing without being it'],
        why: 'It is not the theory that pain is correlated with, or caused by, C-fibre firing — pain <b>is</b> C-fibre firing. Correlation and causation both leave room for the dualist’s second thing.' },
      { q: 'What is Smart’s main reason for preferring the identity theory to dualism?',
        o: ['Occam’s razor: with the evidence equal, prefer the theory positing less',
            'Leibniz’s law: mental and brain states can be shown to share all properties',
            'Introspection: attending closely to sensations reveals them to be brain processes',
            'Neuroscience: experiments have conclusively proven that pain is C-fibre firing'],
        why: 'Dualism needs non-physical states plus psychophysical laws to explain what physics explains alone. Smart doesn’t claim neuroscience has proven the identity, and introspection reveals nothing about neurons.' },
      { q: 'Occam’s razor is best described as the principle that we should:',
        o: ['Prefer the simplest explanation — the one requiring the fewest assumptions',
            'Hold that identical things share every one of their properties without exception',
            'Assume every physical event with a sufficient cause has a sufficient physical cause',
            'Believe only what can be publicly observed and measured by independent observers'],
        why: 'The others are Leibniz’s law, (a version of) causal closure, and behaviourism’s publicity premise.' },
      { q: 'Why does Smart compare “pain is C-fibre firing” to “lightning is an electrical discharge”?',
        o: ['Both are identities discovered empirically, not by analysing what the words mean',
            'Both are definitions that anyone who understands the words can know a priori',
            'Both describe a causal relation between two distinct phenomena that co-occur',
            'Both show that one phenomenon can be realised by many physical mechanisms'],
        why: 'People talked about lightning long before anyone knew about electricity. The identity was discovered, not read off the meaning of “lightning” — and the same goes for pain.' },
      { q: '“People talked competently about pain long before anyone knew about neurons, so ‘pain’ can’t mean ‘C-fibre firing’.” How would Smart respond?',
        o: ['Agree “pain” doesn’t mean “C-fibre firing”: the identity is empirical, not semantic',
            'Argue that people implicitly knew about neurons all along, even before neuroscience',
            'Concede that pain must therefore be a non-physical property of the person',
            'Reply that “pain” is a meaningless word which a mature science should eliminate'],
        why: 'Smart grants the premise and denies the inference. You can be competent with “pain” without knowing any neurophysiology, just as with “lightning” or “water”.' },
      { q: 'Leibniz’s law states that:',
        o: ['If x is identical to y, whatever is true of x is true of y',
            'If x and y are perfectly correlated, then x is identical to y',
            'If x and y share some of their properties, then x is identical to y',
            'If x causes y, then x and y must be two distinct things'],
        why: 'The indiscernibility of identicals. Its contrapositive is the weapon: find one difference and the identity fails.' },
      { q: '“My after-image is yellowish-orange, but no brain process is yellowish-orange, so the after-image is not a brain process.” This argument relies on:',
        o: ['Leibniz’s law', 'Occam’s razor', 'The causal closure of the physical', 'Multiple realisability'],
        why: 'It finds a property one side has and the other lacks. Smart’s reply: what is identical to the brain process is the <i>experience</i> of having an after-image, and the experience isn’t yellowish-orange.' },
      { q: 'On Smart’s view, how are “Jack cries out because he is in pain” and “Jack cries out because his C-fibres are firing” related?',
        o: ['They are one explanation expressed in different words',
            'The first is a psychological explanation that competes with the second',
            'The first is false and should be replaced by the second',
            'The second explains the first by citing what causes the pain'],
        why: 'If pain is C-fibre firing there is one cause, named twice. Replacing the first is eliminativism; treating C-fibres as the cause of pain is the dualist’s picture.' },
      { q: 'Where does the dualist add something to the causal chain from Jack’s injury to his cry?',
        o: ['At the brain: C-fibre firing gives rise to a non-physical pain, which triggers the signal',
            'At the foot: a non-physical cause starts the nerve signal travelling towards the brain',
            'At the throat: the non-physical pain directly moves the vocal cords to produce the cry',
            'Nowhere: the dualist accepts the same purely physical chain and just adds a new name'],
        why: 'The dualist inserts psychophysical laws at the brain: C-fibres fire → Jack’s (non-physical) pain → brain sends the signal. Smart: that extra link is surplus.' },
      { q: 'What kind of identity theory is Smart’s?',
        o: ['Type identity: each kind of mental state is a kind of brain state',
            'Token identity: each mental event is some physical event, but kinds differ',
            'Functional identity: each mental state is identical to a causal role',
            'Behavioural identity: each mental state is a disposition to behave'],
        why: 'Smart identifies mental <b>types</b> with physical types — which is what makes him reductive, and what multiple realisability attacks. Token-only identity is Davidson.' },
      { q: '“Clark Kent is Superman.” What does this identity statement tell us?',
        o: ['There is one person, picked out by two names',
            'There are two people who are always seen together',
            'Clark Kent causes Superman to appear when needed',
            'The two share some, but not all, of their properties'],
        why: 'Identity is the relation everything has to itself and to no other thing: one thing, not two. Sharing only some properties would make them distinct, by Leibniz’s law.' },
      { q: 'Which would most directly count as evidence <i>against</i> the identity “pain = brain state B”?',
        o: ['Someone in pain without being in B, or in B without pain',
            'Brain imaging showing that B occurs whenever pain is reported',
            'Lesions that prevent B also turning out to prevent pain',
            'People having talked about pain long before neuroscience'],
        why: '<b>Dissociation</b> refutes an identity: identical properties can’t come apart. Imaging and lesion data support the identity; the last option is about meaning, which Smart sets aside.' },
      { q: 'Why does a perfect correlation between pain and brain state B fail to prove that pain is B?',
        o: ['B might cause pain, pain might cause B, or both might share a common cause',
            'Correlations between mind and brain can only ever be detected by introspection',
            'Leibniz’s law forbids identifying any mental thing with any physical thing',
            'Pain is known by definition, whereas B can only be known by experiment'],
        why: 'The sample model answer’s point: correlation supports identity but doesn’t entail it. A dualist with psychophysical laws predicts exactly the same correlations.' },
      { q: 'Being a cup of coffee and being a cup of Mary’s favourite drink might apply to exactly the same things. What does this example show?',
        o: ['Coextensive properties need not be identical, so co-occurrence can’t guarantee identity',
            'Properties that apply to exactly the same things must be one and the same property',
            'Mental properties can never be identical to physical properties, however correlated',
            'Identity statements about properties are always true by definition, never discovered'],
        why: 'Coextension is necessary for property identity but not sufficient. Mary could have liked tea — the coincidence is accidental.' }
    ],

    functionalism: [
      { q: 'According to Putnam’s functional-state hypothesis, what makes a state a pain?',
        o: ['Its causal role: its relations to inputs, outputs and other internal states',
            'Its physico-chemical make-up: the type of neural tissue in which it occurs',
            'The behaviour the organism actually displays when it is damaged or injured',
            'Its intrinsic felt quality, which only the subject can know by introspection'],
        why: 'A functional state is individuated by what it <b>does</b> within the organism’s functional organisation, not by what it is made of (Smart) or by outward behaviour alone (behaviourism).' },
      { q: 'The multiple realisability argument is aimed primarily at:',
        o: ['The type identity theory', 'Materialism, the view that everything is physical', 'Davidson’s token identity theory', 'Methodological behaviourism'],
        why: 'MR says one mental type can be realised by many physical types, which contradicts type identity. Each realiser can still be physical, so materialism and token identity survive.' },
      { q: 'Which observation best supports multiple realisability?',
        o: ['Octopuses, with very different nervous systems from ours, seem able to feel pain',
            'In humans, pain always co-occurs with the firing of a particular type of fibre',
            'People talk about pain competently without knowing any neuroscience at all',
            'A skilled actor can fake pain behaviour convincingly without feeling any pain'],
        why: 'The octopus is Putnam’s kind of case: the same psychological state with very different physical correlates.' },
      { q: 'Putnam calls the brain-state hypothesis “ambitious” because:',
        o: ['It needs one physico-chemical state shared by every creature that can feel pain',
            'It claims to explain consciousness entirely in terms of observable behaviour',
            'It claims that the word “pain” can be defined a priori in neural vocabulary',
            'It claims that no machine or computer will ever be able to feel any pain'],
        why: 'To be true, the identity theory must hold for every creature that can feel pain — mammals, molluscs, perhaps aliens. Putnam thinks that is highly implausible.' },
      { q: 'In what way does functionalism improve on behaviourism?',
        o: ['It treats mental states as inner causes that can be defined via other mental states',
            'It identifies each type of mental state with a particular type of brain state',
            'It denies that behaviour is any evidence at all for the presence of mental states',
            'It holds that mental states can be studied only through careful introspection'],
        why: 'Functional states are inner causes, and their definitions may mention beliefs and desires — so the holism objection that sinks behaviourism doesn’t touch functionalism.' },
      { q: 'Which analogy is most often used to illustrate functionalism?',
        o: ['Software and hardware: one program, many machines',
            'Lightning and electrical discharge: one thing, two names',
            'A fragile vase: it would break if it were struck',
            'Red and scarlet: a determinable and its determinate'],
        why: 'Functional organisation is like a program, realisable in different hardware. Lightning is Smart; the vase is behaviourism; red/scarlet is Yablo.' },
      { q: 'According to Putnam, is the functional-state hypothesis compatible with dualism?',
        o: ['In principle yes — a soul could realise a functional organisation',
            'No — functionalism is a type identity theory, so it entails materialism',
            'No — functional states are defined in the vocabulary of brain chemistry',
            'Yes — functionalism says mental states are states of a non-physical substance'],
        why: 'Putnam remarks that a body-plus-soul system could be a probabilistic automaton. Functionalism says what mental states are; it doesn’t say what must realise them.' },
      { q: 'How might Smart respond to the multiple realisability argument?',
        o: ['Accept species-specific identities: pain-in-humans is C-fibre firing, and so on',
            'Deny that pain is a physical state at all, and accept that it is non-physical',
            'Argue every animal must have C-fibres, since all animals share common ancestors',
            'Accept that pain is a non-physical property merely correlated with brain states'],
        why: 'Local (species-specific) identities keep type identity within each kind of creature. The cost: “pain” no longer names one thing all pains share. Other options: disjunctive identities, or arguing MR is empirically overstated.' },
      { q: 'How does Davidson’s view handle multiple realisability?',
        o: ['Comfortably — he never claimed mental types are physical types',
            'Badly — his view identifies each mental type with a physical type',
            'He rejects it: every belief is realised by one and the same neural pattern',
            'He accepts it by becoming a dualist about mental events and their causes'],
        why: 'Davidson holds token identity only, and denies there is a neural pattern everyone who believes the sky is blue must share. MR is what he would expect.' },
      { q: 'Why is functionalism described as less reductive than Smart’s identity theory?',
        o: ['Functional states are higher-level states that many physical systems realise',
            'Functionalism denies that mental states have any physical causes or effects',
            'Functionalism is a version of eliminativism, so it has nothing to reduce',
            'Functionalism identifies mental states with patterns of outward behaviour'],
        why: 'A computational state could be recognised in an octopus too. It is identified by role, not by one physical kind.' }
    ],

    searle: [
      { q: '“Strong AI”, as Searle defines it, is the claim that:',
        o: ['A suitably programmed computer literally understands, just by running its program',
            'Computers are useful tools for modelling, simulating and studying the human mind',
            'Computers will one day outperform humans at every cognitive task we can name',
            'No machine could ever think, because thinking requires a biological brain'],
        why: 'Tools for studying the mind is <b>weak AI</b>, which Searle accepts. The last option overstates Searle’s own view.' },
      { q: 'In the Chinese Room, what is the person inside doing?',
        o: ['Following English rules for manipulating Chinese symbols by their shapes',
            'Translating each Chinese question into English and the answers back again',
            'Slowly learning Chinese from the feedback he gets on each of his answers',
            'Passing the questions to a native Chinese speaker hidden in the room'],
        why: 'The point is that he only uses the symbols’ shapes (syntax), never their meanings. Translation would require understanding.' },
      { q: 'Which premise is central to Searle’s argument?',
        o: ['Syntax by itself is not sufficient for semantics',
            'Semantics reduces to sufficiently complex syntax',
            'Whatever passes the Turing test understands what it says',
            'Only beings made of carbon can have minds'],
        why: 'Programs are purely syntactic; minds have semantic content; syntax doesn’t yield semantics — so programs don’t suffice for minds. Searle never says carbon is required, only causal powers equivalent to the brain’s.' },
      { q: 'The systems reply to the Chinese Room says that:',
        o: ['The man doesn’t understand, but the whole system — man, rules, paper — does',
            'The room would understand if it were connected to cameras and motors',
            'A program simulating a Chinese speaker’s neurons would understand',
            'We can only know anyone understands Chinese by observing their behaviour'],
        why: 'The others are the robot reply, the brain simulator reply and the other minds reply.' },
      { q: 'How does Searle respond to the systems reply?',
        o: ['Let the man memorise the rules and work in his head; he still understands nothing',
            'He concedes that the system understands, but denies that the man himself does',
            'He argues that a rulebook adequate for fluent Chinese could never be written',
            'He argues that no system can ever have a property that none of its parts has'],
        why: 'The internalisation reply. Searle doesn’t deny systems can have features their parts lack in general — he thinks consciousness is such a feature of the brain.' },
      { q: '“Simulation is not duplication.” Which example illustrates Searle’s point?',
        o: ['A simulated rainstorm leaves nobody wet',
            'A parrot can repeat words without understanding them',
            'A calculator adds numbers faster than a human can',
            'An actor can feign pain without feeling it'],
        why: 'Simulating a process doesn’t reproduce its causal powers — not for storms, not for digestion, and not, Searle says, for understanding.' },
      { q: 'Which statement would Searle accept?',
        o: ['Some machines think — human brains are biological machines',
            'No machine of any kind could ever think or understand',
            'A computer that passes the Turing test thereby understands',
            'Understanding is just giving the right outputs for the inputs'],
        why: 'Searle’s target is narrow: nothing thinks <i>solely in virtue of</i> running a program. Brains are machines, and they think.' },
      { q: 'According to Searle, what would an artificial system need in order to think?',
        o: ['Causal powers equivalent to those of the brain, not just a program',
            'A program that is large and complex enough to model a whole brain',
            'The ability to pass the Turing test in several different languages',
            'A robot body with sensors and motors connecting it to the world'],
        why: '“Brains cause minds.” Anything else that thinks must duplicate the relevant causal powers. Adding a robot body is the robot reply, which Searle rejects.' },
      { q: 'Why is the Chinese Room also an objection to functionalism?',
        o: ['The room has the right functional organisation for Chinese, yet nothing understands',
            'The room shows that mental states are identical to particular types of brain state',
            'The room shows that behaviour is all there is to understanding a language',
            'The room shows that functional states can never be realised in more than one way'],
        why: 'If having the right functional organisation were enough for a mental state, the room would understand. Searle says it doesn’t.' },
      { q: 'The robot reply adds cameras and motors to the computer. What is Searle’s response?',
        o: ['The camera input just arrives as more symbols the man doesn’t understand',
            'Cameras good enough to give the robot real perception could never be built',
            'A body would produce understanding, so strong AI is vindicated for robots',
            'Robots lack the causal powers needed to move their arms and act in the world'],
        why: 'Hooking symbols up to the world doesn’t change what the man is doing: shuffling shapes he doesn’t understand.' },
      { q: 'Searle’s conclusion from the Chinese Room is best stated as:',
        o: ['Nothing understands solely in virtue of running a program',
            'Computers can never be conscious under any circumstances',
            'Only human beings will ever be able to understand language',
            'Research in artificial intelligence is pointless and should stop'],
        why: 'The conclusion is about programs. It leaves open machines with brain-like causal powers, and it endorses weak AI as research.' }
    ],

    davidson: [
      { q: 'Which three claims make up the apparent inconsistency (“paradox”) that Davidson sets out to resolve?',
        o: ['Mental events cause physical events; causes and effects fall under strict laws; there are no strict mental laws',
            'Mental events are non-physical; physical events have only physical causes; mental events cause physical events',
            'Mental states are brain states; brain states are multiply realisable; mental states are functional states',
            'Every event has a cause; every cause is a physical event; every mental event is caused by a physical one'],
        why: 'Causal interaction, the nomological character of causality, and the anomalism of the mental. The second option is closer to the dualist’s problem with closure.' },
      { q: 'In “anomalous monism”, what does “anomalous” refer to?',
        o: ['The absence of strict laws governing mental events',
            'Mental events being rare and unpredictable brain events',
            'Mental events having no physical causes at all',
            'Mental events being non-physical events'],
        why: 'A-nomos: without law. The mental is not governed by strict laws. It says nothing about mental events being uncaused or non-physical.' },
      { q: 'In “anomalous monism”, what does “monism” refer to?',
        o: ['Every event, mental events included, is a physical event',
            'There is just one mind, of which individual minds are parts',
            'Every mental property is identical to one physical property',
            'Mental and physical events obey one single causal law'],
        why: 'Monism: every mental event is a physical event (token identity). Property identity is exactly what Davidson rejects.' },
      { q: 'Davidson holds that:',
        o: ['Every mental event is a physical event, but mental properties aren’t physical properties',
            'Every mental property is a physical property, but mental events aren’t physical events',
            'Mental events are linked to physical events by strict psychophysical laws',
            'Mental events are non-physical events that supervene on physical events'],
        why: 'Token identity without type identity.' },
      { q: '“Every coloured thing is a shaped thing, but no colour property is a shape property.” This analogy illustrates the difference between:',
        o: ['Token identity and type identity', 'Supervenience and emergence', 'Determinables and determinates', 'Methodological and philosophical behaviourism'],
        why: 'Tokens (particular things or events) can be identical even when the properties they have belong to different families.' },
      { q: 'Why does Davidson think there are no strict psychophysical laws?',
        o: ['Mental attribution answers to norms of rationality that physical theory lacks',
            'Mental events are non-physical, so they lie outside the scope of any physical law',
            'Neuroscience has not yet found the laws, though it may well do so in the future',
            'Mental events have no causes, so there is nothing for any law to describe'],
        why: 'We attribute beliefs and desires according to what makes rational sense — a normative constraint. Physical concepts answer to no such norms. It is a principled claim, not “not yet discovered”.' },
      { q: 'For Davidson, “believe in accordance with your evidence” is:',
        o: ['A norm — what you should do — not a law of what you always do',
            'A strict psychological law, since everyone in fact does it',
            'A psychophysical law that links evidence to brain states',
            'A definition of what it is to have a properly working brain'],
        why: 'People violate norms of rationality all the time. That is why rationality can’t supply strict, exceptionless laws.' },
      { q: 'How does Davidson resolve his paradox?',
        o: ['Each mental event is physical, and falls under strict laws as physically described',
            'He denies that mental events ever cause physical events, keeping the other two claims',
            'He accepts that there are strict psychophysical laws after all, keeping the other two',
            'He denies that causal relations require laws, keeping the other two claims intact'],
        why: 'He keeps all three principles. Laws relate events under descriptions: the mental event has a physical description under which it falls under strict physical laws.' },
      { q: 'On Davidson’s view, a belief that the sky is blue is:',
        o: ['A neural event in each believer, with no neural pattern all believers must share',
            'The same neural activation pattern in everyone who believes the sky is blue',
            'A non-physical event that is lawfully correlated with a pattern of neural activity',
            'A disposition to say “the sky is blue” when asked about the colour of the sky'],
        why: 'What makes it that belief is its rational role in the person’s psychology, not any particular neural pattern. (Falsifiable: thought-decoding results so far are limited.)' },
      { q: '“Propositional attitudes” are:',
        o: ['States like believing or fearing that something is so, which have content',
            'Sensations like pains and after-images, which have a distinctive feel',
            'Behavioural dispositions like fragility, which are revealed in behaviour',
            'Neural states that store sentences of a language in the brain'],
        why: 'Attitudes expressed with a “that…” clause. Having content is <b>intentionality</b>.' },
      { q: 'Laws of nature (nomological laws), unlike human laws, are:',
        o: ['General, exceptionless and descriptive; they support induction',
            'Normative: they say what we ought to do, and can be broken',
            'Rough generalisations that hold only other things being equal',
            'Definitions, true in virtue of the meanings of their words'],
        why: 'Human laws are normative. Rough ceteris paribus generalisations are what psychology has — which is Davidson’s point.' },
      { q: 'What does Davidson mean by saying that one event can be described in many ways?',
        o: ['One event can be picked out both as a belief that p and as a neural pattern',
            'Different observers will perceive one and the same event in different ways',
            'Every event has a great many different causes, each giving a description',
            'One mental state can be realised by many different physical states'],
        why: 'Descriptions, not realisations: the same event, two descriptions. Multiple realisation (the last option) is about types.' }
    ],

    supervenience: [
      { q: '“The mental supervenes on the physical” means:',
        o: ['There can be no mental difference without a physical difference',
            'There can be no physical difference without a mental difference',
            'Every mental property is identical to some physical property',
            'Mental properties are caused by underlying physical properties'],
        why: 'Fix the physical and you fix the mental. The reverse direction is false — many physical differences make no mental difference.' },
      { q: 'If the mental supervenes on the physical, then two creatures that are exact physical duplicates:',
        o: ['Must also be exact mental duplicates',
            'May differ mentally, but cannot differ in behaviour',
            'Must behave alike but may differ in experience',
            'Must have neurons of the same type as humans'],
        why: 'Physical duplicates are mental duplicates — often treated as the minimal commitment of materialism.' },
      { q: 'Which example best illustrates multiple realisability within a supervenience relation?',
        o: ['Many tile arrangements can make up the same mosaic picture',
            'Water is H₂O: one substance under two descriptions',
            'Clark Kent is Superman: one person with two names',
            'Lightning is electrical discharge: a discovered identity'],
        why: 'The picture supervenes on the tiles — no change in picture without a change in tiles — yet many tile configurations give the same picture. The others are identities.' },
      { q: 'Supervenience is said to be asymmetric. This means that:',
        o: ['A can supervene on B without B supervening on A',
            'If A supervenes on B, then B supervenes on A too',
            'Supervening properties are more fundamental than their bases',
            'Supervenience holds in only one possible world, the actual one'],
        why: 'The mental depends on the physical, but physical facts aren’t fixed by mental facts — many physical states realise one mental state.' },
      { q: 'What two main reasons were given in lectures for resisting a reductive explanation of the mind?',
        o: ['Consciousness and reason', 'Occam’s razor and Leibniz’s law', 'Behaviour and language', 'Free will and personal identity'],
        why: 'Consciousness: something it is like to be you, nothing it is like to be an electron. Reason: psychological explanation answers to rational norms (Davidson).' },
      { q: 'A zombie would be physically identical to you but have no conscious experience. If zombies were genuinely possible, this would show that:',
        o: ['Consciousness doesn’t supervene on the physical, so materialism is false',
            'Consciousness does supervene on the physical, so materialism is true',
            'Behaviourism is true, since zombies behave exactly as we do',
            'Consciousness is C-fibre firing, since zombies have no C-fibres'],
        why: 'A mental difference without a physical difference is a failure of supervenience. The materialist’s best reply is that zombies are conceivable but not possible.' },
      { q: 'Why is supervenience often said to be insufficient on its own for materialism?',
        o: ['It says the physical fixes the mental, but not why — a dualist could accept that too',
            'It entails that mental properties are identical to physical ones, which is too strong',
            'It denies that the mental depends on the physical, which materialism requires',
            'It rules out multiple realisability, which every materialist needs to allow'],
        why: 'From the lecture: supervenience gives a correlation but not a reason why. A dualist with necessary psychophysical laws could accept the same dependence.' },
      { q: 'Weak emergence is:',
        o: ['Novelty that is epistemic: unpredictable only given our cognitive limits',
            'Genuinely new properties with novel causal powers at higher levels',
            'The view that consciousness is an illusion produced by the brain',
            'The view that only the fundamental physical level is really real'],
        why: 'Weak emergence is uncontroversial. Genuinely new properties with novel causal powers is <b>strong</b> emergence.' },
      { q: 'Which example illustrates emergence as presented in lectures?',
        o: ['Locusts swarming in a way no single locust does',
            'A vase breaking because it is fragile and was struck',
            'Water turning out to be identical to H₂O',
            'A person reporting a yellowish-orange after-image'],
        why: 'Swarming, and the capabilities of artificial neurons in combination, are the lecture’s examples of system-level novelty.' },
      { q: 'On the “layer-cake” picture, reductivism holds that:',
        o: ['Higher levels are fully explained by lower ones; in a sense only the bottom is real',
            'Each layer is real and distinct, with its own causal powers that cannot be reduced',
            'The top layer — minds — explains all of the layers beneath it, down to physics',
            'There is no bottom layer, so explanation must go on downwards without end'],
        why: 'Temperature is molecular energy; water is H₂O. Distinct, real higher layers is the non-reductivist’s picture.' },
      { q: 'Which is an example of a reductive identification?',
        o: ['Temperature is mean molecular kinetic energy',
            'Inflation supervenes on millions of decisions',
            'Pain is a multiply realisable functional state',
            'Belief is governed by norms of rationality'],
        why: 'The higher-level property is identified with lower-level stuff. Supervenience, functional states and rational norms are all non-reductive ideas.' },
      { q: 'Which claim is often treated as the minimal commitment of materialism?',
        o: ['Exact physical duplicates are exact mental duplicates',
            'Every mental property is identical to a neural property',
            'Psychology must restrict itself to observable behaviour',
            'Every mental state is a disposition to behave'],
        why: 'Supervenience is weaker than type identity, so reductive and non-reductive materialists can both accept it.' }
    ],

    kim: [
      { q: 'Kim’s principle of the causal closure of the physical states that:',
        o: ['Every physical event with a sufficient cause has a sufficient physical cause',
            'Every physical event has a physical cause, so no physical event is uncaused',
            'No mental event can ever have a physical cause or a physical effect',
            'Every event, whether mental or physical, is caused by some physical event'],
        why: 'Closure allows physical events that just happen. It says that where there is a sufficient cause, there is a physical one — tracing back, we never need to appeal to anything non-physical.' },
      { q: 'What is causal overdetermination?',
        o: ['An effect having more than one sufficient cause',
            'A cause having more than one effect',
            'An effect having no sufficient cause',
            'A cause more specific than its effect requires'],
        why: 'Two assassins’ bullets arriving at once. The last option is a failure of proportionality (Yablo).' },
      { q: 'Kim’s exclusion argument concludes that non-reductive materialists must either:',
        o: ['Reduce mental properties to physical ones, or accept they are causally idle',
            'Accept substance dualism, or else accept philosophical behaviourism',
            'Reject the causal closure of the physical, or else reject Leibniz’s law',
            'Accept functionalism, or else accept the conclusion of the Chinese Room'],
        why: 'The realiser does all the causal work, so the mental property is either the realiser (reduction) or does nothing (epiphenomenalism).' },
      { q: 'If successful, Kim’s argument shows that:',
        o: ['Only reductive materialism makes sense of the mind’s causal powers',
            'Only substance dualism makes sense of the mind’s causal powers',
            'Mental causation is impossible whatever view of mind we adopt',
            'The mental does not supervene on the physical after all'],
        why: 'Reductive materialism escapes: if pain is the neural state, pain causes what the neural state causes.' },
      { q: 'Why does Kim reject overdetermination as a way out?',
        o: ['Every mentally caused action would be caused twice over, which is implausible',
            'Overdetermination is logically impossible, so it can never actually happen',
            'Overdetermination would require at least one of the causes to be non-physical',
            'Mental properties are never sufficient on their own to bring anything about'],
        why: 'Overdetermination happens (firing squads), but treating every action as overdetermined is ad hoc. If one sufficient cause does the work, there is no work left for the other.' },
      { q: 'Which claim is NOT a core commitment of non-reductive physicalism?',
        o: ['Every mental property is identical to a physical property',
            'All concrete particulars are physical',
            'Mental properties are real and irreducible',
            'All mental properties are realised by physical mechanisms'],
        why: 'From the Week 4 exercise. Property identity is what makes a view <i>reductive</i>. The other three are core commitments.' },
      { q: 'According to Kim, non-reductive physicalism ends up committed to which troublesome claim?',
        o: ['Mental properties have novel causal powers — they are strongly emergent',
            'Mental events are events in a non-physical substance distinct from the body',
            'Every mental property is identical to some physical property of the brain',
            'Mental properties fail to supervene on the physical properties of the brain'],
        why: 'Real, irreducible, causally efficacious mental properties would be strongly emergent, and Kim argues strong emergence is incompatible with causal closure.' },
      { q: 'Who said, roughly, that if mental causation isn’t real then practically everything we believe about anything is false and it is “the end of the world”?',
        o: ['Fodor', 'Kim', 'Davidson', 'Smart'],
        why: 'Fodor — which is why Kim’s threat to mental causation matters so much.' },
      { q: 'Kim’s argument seems to threaten not only mental causation but:',
        o: ['Causal claims of common sense and of every science but fundamental physics',
            'Only the causal claims that neuroscience makes about brains and behaviour',
            'Only the causal claims made by dualists about souls and their effects',
            'Even the causal claims of fundamental physics, which lose their causes too'],
        why: 'The generalisation worry: biological, chemical and economic properties are all realised by lower-level properties, so the same exclusion reasoning applies.' },
      { q: 'A desire for water is realised by neural state N, and N alone is sufficient to make the arm reach for a glass. Which premise of Kim’s argument guarantees the reaching has a sufficient physical cause?',
        o: ['The causal closure of the physical', 'The multiple realisability of mental states', 'Leibniz’s law of the indiscernibility of identicals', 'The anomalism of the mental'],
        why: 'The reaching is a physical event with a sufficient cause, so by closure it has a sufficient physical cause — N. Exclusion then leaves the desire nothing to do.' },
      { q: 'What does Kim think of strong emergence?',
        o: ['It is incoherent, since novel causal powers would conflict with causal closure',
            'It is everywhere — life and consciousness are both strongly emergent',
            'It is uncontroversial, since swarming locusts show it happening all the time',
            'It is the best defence of non-reductive physicalism against the exclusion problem'],
        why: 'Others think strong emergence is everywhere; Kim thinks it is incoherent with closure. Locust swarming shows only weak emergence.' },
      { q: 'In Kim’s argument, a “sufficient cause” is one that:',
        o: ['Is enough to guarantee its effect',
            'Is necessary for its effect to occur',
            'Is the most proportionate cause of its effect',
            'Is a physical event rather than a mental one'],
        why: 'Sufficient = enough to guarantee. Necessary is a different relation; proportionality is Yablo’s notion.' }
    ],

    yablo: [
      { q: 'Which pair stands in the determinable–determinate relation?',
        o: ['Red (determinable) and scarlet (determinate)',
            'Scarlet (determinable) and red (determinate)',
            'Water (determinable) and H₂O (determinate)',
            'Pain (determinable) and wincing (determinate)'],
        why: 'Colour → red → scarlet runs from less to more determinate. Being scarlet is a specific way of being red. Water/H₂O is an identity.' },
      { q: 'Sophie the pigeon is trained to peck at red. Shown a scarlet chip, she pecks. Why does Yablo say the cause is the chip’s being red rather than its being scarlet?',
        o: ['She’d have pecked at any red chip, so scarlet adds detail that made no difference',
            'Redness is easier for an observer to detect than the specific shade scarlet',
            'Scarlet is not a real property of the chip, only a way of describing red',
            'Red and scarlet compete, and the more general property always wins out'],
        why: 'Proportionality. Had the chip been crimson she would still have pecked. It isn’t that the more general property always wins: “coloured” is too unspecific.' },
      { q: 'Proportionality says that a cause should be:',
        o: ['Specific enough to make the difference, but without irrelevant detail',
            'As specific as possible, since more detail always makes a better cause',
            'As general as possible, since the most abstract property is the cause',
            'Physical, since only physical properties can ever be genuine causes'],
        why: 'Not too unspecific, not too specific.' },
      { q: 'How does Yablo apply the determinable/determinate relation to the mind?',
        o: ['Mental properties are determinables of their neural realisers, as red is of scarlet',
            'Neural states are determinables of mental properties, as red is of scarlet',
            'Mental properties are identical to their neural realisers, as water is to H₂O',
            'Mental properties are strongly emergent, with causal powers of their own'],
        why: 'Your brain state while in pain is a determinate of the determinable being in pain, so the two don’t compete. Identity would be reductivism, not Yablo’s defence of non-reductivism.' },
      { q: 'Yablo intends proportionality to be:',
        o: ['A metaphysical constraint on what really causes what',
            'An epistemic constraint reflecting what we happen to know',
            'A pragmatic rule about which explanation is most convenient',
            'A definition of what it is for one property to supervene'],
        why: 'The claim is about what the causes really are, not which answers we prefer. Whether it succeeds is one of the open questions.' },
      { q: 'Yablo’s response to Kim mainly denies which assumption?',
        o: ['That a mental property and its realiser compete, so one must exclude the other',
            'That every physical event with a sufficient cause has a sufficient physical cause',
            'That there can be no mental difference without some physical difference',
            'That mental properties really do cause behaviour, as common sense assumes'],
        why: 'Yablo accepts closure and supervenience. Exclusion applies to independent rival causes, and determinables and their determinates aren’t rivals.' },
      { q: '“Determinates can be too specific; determinables can be too unspecific.” Which is the best candidate cause of Jack crying out after stubbing his toe?',
        o: ['His being in pain, since any realiser of the pain would have done',
            'The exact firing pattern of every neuron in his brain at that moment',
            'His being in some mental state or other at the time of the injury',
            'The particular molecular structure of his vocal cords and larynx'],
        why: 'The exact pattern is too specific (other realisers would have done); “some mental state or other” is too unspecific (he wouldn’t cry out at a pleasant thought).' },
      { q: 'Which discovery would most threaten Yablo’s analogy between mental properties and determinables?',
        o: ['Neural states turn out not to be specific ways of being in a mental state',
            'Pigeons turn out to be trainable to peck at red things but not at others',
            'Mental properties turn out to be realisable in many different physical ways',
            'The physical world turns out to be causally closed, as Kim claims it is'],
        why: 'The defence needs the relation to really be determinable/determinate, as scarlet is a way of being red. Multiple realisability actually suits Yablo, and he accepts closure.' },
      { q: 'What does Yablo’s brick example illustrate?',
        o: ['The brick and its particles don’t compete to break the window',
            'The window is broken twice: once by the brick, once by its particles',
            'Only the particles really break the window; the brick is idle',
            'The brick breaks the window only if its particles fail to do so'],
        why: 'Macrophysical properties and their realisers do not compete for causal relevance. Nobody thinks the window was broken twice, or that the brick is idle.' }
    ]
  };

  /* ========================= extended response ============================
     sample: n  marks a question from the official sample-question handout,
     reproduced word for word. plan = [heading, [points]]; must = checklist. */

  var ESSAYS = {
    dualism: [
      { q: 'Explain Descartes’ argument that the mind is a distinct substance from the body. Is the argument convincing?',
        plan: [
          ['Thesis', ['Descartes argues from essences: thinking and extension are different essences, so mind and body are different substances. The argument is valid, but its key premise — that thinking is my <i>whole</i> essence — is not established.']],
          ['Background', ['Scientific revolution: one uniform material substance whose essence is extension; bodies are machines moved by pushes and pulls.', 'A substance is a kind of stuff or an individual thing. Its properties are essential (defining) or accidental (optional).', 'Motivation: mechanism might explain a cat, but reason, flexible language and free will seemed beyond any mechanism.']],
          ['The argument', ['P1: my essence is thinking — nothing else belongs to my nature.', 'P2: the essence of body is extension (an extended, non-thinking thing).', 'P3: things that differ in essence are different substances.', 'C: I am distinct from any material body — substance dualism.']],
          ['Assessment', ['P1 is the weak point. From the fact that I can conceive of myself as thinking without conceiving of a body, it doesn’t follow that I could exist without one: conceivability is not possibility.', 'Compare lightning: one could conceive of lightning without conceiving of electrical discharge, yet lightning is an electrical discharge. My concept of myself may simply be silent on my physical nature.', 'A related slip: “I can doubt my body exists but not my mind” uses a property (being doubted by me) that depends on how I think of a thing, so Leibniz’s law doesn’t apply.']],
          ['Further cost', ['Elisabeth’s interaction problem: an unextended thinking substance seems unable to push or be pushed by matter, so the conclusion leaves mind–body causation mysterious — the mind becomes a ghost.']],
          ['Conclusion', ['Valid in form, but the essence premise assumes what needs proving, and the conclusion creates the interaction problem. Not convincing as it stands.']]
        ],
        must: ['Explained substance, essence, and thinking vs extension', 'Set out the argument as premises and conclusion', 'Challenged the move from what I can conceive to what I am', 'Mentioned the interaction problem as a further cost', 'Reached a clear evaluative verdict'] },
      { q: 'Explain Elisabeth of Bohemia’s objection to Descartes. Why is it so difficult for a substance dualist to answer, and does a similar problem arise for materialist theories of mind?',
        plan: [
          ['Thesis', ['Elisabeth shows dualism is incomplete without an account of how mind and body interact. It is hard for Descartes because his own physics makes causation a matter of contact. A version of the problem returns for non-reductive materialism (Kim).']],
          ['The objection', ['Elisabeth takes interaction as obvious: thinking causally influences, and is influenced by, material things (I will and my arm rises; injury causes pain).', 'In Descartes’ mechanical world, bodies move by contact and pushing, which requires extension.', 'The mind is unextended. How can it push, or be pushed?']],
          ['Why it is hard', ['The mind lacks exactly the property (extension) that causal interaction seems to need; if it had extension, it would be body.', 'Descartes’ appeal to the mind–body union as a primitive notion explains nothing.', 'The result is the “ghost” worry: a mind that exists but cannot causally interact with anything physical.']],
          ['Materialist answers', ['Smart: pain is C-fibre firing, so it causes the cry the way any physical event does — no extra link to explain.', 'Davidson: each mental event is a physical event, so it falls under physical laws and can cause physical effects.']],
          ['The problem returns', ['Materialists assumed mental causation was a problem for dualists only. Kim: if mental properties are irreducible (non-reductive physicalism), then given causal closure the physical realiser does all the work, and the mental property is excluded.', 'So Elisabeth’s challenge reappears for properties rather than substances: how does something distinct from the physical make a physical difference?']],
          ['Conclusion', ['Elisabeth’s objection is the template for the mental causation problem. Only identity (Smart) clearly answers it — unless a non-reductivist answer such as Yablo’s works.']]
        ],
        must: ['Stated the objection precisely (contact and extension vs an unextended mind)', 'Explained why Descartes’ mechanistic physics makes it acute', 'Mentioned the “ghost” worry', 'Gave a materialist answer (Smart or Davidson)', 'Explained how Kim revives the problem for non-reductive materialism'] },
      { q: 'Compare Aristotle’s conception of the soul with Descartes’ conception of the mind. Why does materialism “come naturally” on Aristotle’s view but not on the picture of matter that emerged from the scientific revolution?',
        plan: [
          ['Thesis', ['For Aristotle the soul is the organisation of a living body, so there is no gap between matter and mind. The scientific revolution reduced matter to extension, which left no room in matter for thought — so Descartes put the mind outside it.']],
          ['Aristotle', ['Nature is diverse; each kind of thing has its own nature.', 'Living beings have specialised parts in a fixed structure — their form. The soul is that form: nutrition (plants), plus perception and self-movement (animals), plus reason and speech (humans).', 'So all living things have souls, souls can’t exist without bodies, and souls have explanatory payoff.']],
          ['Why materialism comes naturally', ['The soul is not an extra thing but the way matter is organised — a capacity of the body. Nothing needs bridging.', 'The remaining puzzles (what are forms? Ship of Theseus, Zeno) are about matter in general, not about the soul.']],
          ['The new science', ['Uniformity: one kind of stuff whose essence is extension; physics is maths; bodies are machines run by pushes and pulls.', 'Matter now has only geometrical and mechanical properties. A cat’s movements might be mechanised, but reason, language and free will seem not to be.', 'So Descartes makes the mind a separate thinking substance; only humans have one, and animals are machines.']],
          ['Contrast', ['Aristotle: soul as form, inseparable from body, shared by plants and animals. Descartes: mind as substance, separable, only in humans.', 'Aristotle’s view anticipates functionalism (organisation, not stuff); Descartes’ view creates the interaction problem.']],
          ['Conclusion', ['Whether the mind looks like a problem depends on what matter is taken to be. Once matter is mere extension, the mind no longer fits naturally inside it.']]
        ],
        must: ['Explained soul as form and organisation, including plants and animals', 'Explained why this makes materialism natural', 'Described uniformity and extension in the new science', 'Explained why the mind then seemed not to fit (the cat; reason and free will)', 'Drew an explicit contrast (separability; who has a soul or mind)'] }
    ],

    behaviourism: [
      { sample: 2, q: 'Consider a mental state such as wanting ice cream. How would a philosophical behaviourist attempt to analyse such a state? What about a functionalist? Do such cases provide a decisive objection to behaviourism?',
        plan: [
          ['Thesis', ['The behaviourist analyses the want as a disposition to behave; the functionalist as an inner state with a causal role. The case exposes the holism of the mental, which is decisive against philosophical behaviourism but harmless to functionalism.']],
          ['Behaviourist analysis', ['Mental states are behavioural dispositions, on the model of fragility (the vase would break if struck).', 'Wanting ice cream = being disposed to go to the freezer, buy ice cream, say “I’d love one”, accept one if offered… (Skinner: ice cream reinforces me.)', 'It is not an inner cause; “wanting” describes a pattern of behaviour.']],
          ['Functionalist analysis', ['Wanting ice cream is the inner state that is typically caused by heat, hunger or the sight of ice cream; that combines with beliefs (there’s ice cream in the freezer) to cause behaviour (going to the freezer); and that causes other mental states (disappointment if there is none, pleasure when eating).', 'Defined by causal role, so multiply realisable; a real inner cause of behaviour.']],
          ['The objection', ['She goes to the freezer only if she <i>believes</i> there is ice cream there, doesn’t <i>want</i> to keep her diet more, isn’t <i>embarrassed</i> to eat in front of others…', 'Each condition is another mental state, so the analysis never gets rid of mental vocabulary — it is circular, or regresses (holism).', 'Pretenders and suppressors: a dieter who wants ice cream and shows nothing; someone who acts keen without wanting it.']],
          ['Decisive?', ['The behaviourist can try to analyse each further mental state behaviourally, but each needs others in turn, so the analysis never ends.', 'Decisive against <i>philosophical</i> behaviourism as an analysis of meaning; methodological behaviourism (a claim about scientific method) is untouched.', 'Functionalism welcomes the holism: mental states are defined together, by their relations to one another.']],
          ['Conclusion', ['The case shows why the field moved from behaviourism to functionalism.']]
        ],
        must: ['Gave a dispositional (if–then) analysis in behaviourist terms', 'Gave a causal-role analysis mentioning inputs, outputs and other mental states', 'Explained the holism or circularity problem (beliefs and other desires)', 'Evaluated “decisive?” — e.g. decisive against philosophical but not methodological behaviourism', 'Explained why functionalism escapes the objection'] },
      { q: 'Distinguish methodological behaviourism from philosophical (radical) behaviourism. Which is more defensible, and why did Smart reject behaviourism about sensations?',
        plan: [
          ['Thesis', ['Both share the premise that scientific psychology must deal with the publicly observable. Methodological behaviourism is the more defensible because it claims less. Smart rejects behaviourism because sensations are inner causes of behaviour.']],
          ['Common ground', ['Skinner: “why do people behave as they do?” began as a practical question about anticipating others.', 'Least controversial premise: psychology is scientific only if it concerns what can be publicly observed and measured.']],
          ['The two forms', ['Methodological: psychological talk isn’t part of science, so set it aside; treat the mind as a black box and find reliable input/output correlations. Silent on what minds are. Legacy: operant conditioning and reinforcement learning.', 'Philosophical/radical: reinterpret mental concepts as behaviour and dispositions, or discard them. “I like Brahms” → Brahms reinforces me. “Jack is in pain” → Jack is disposed to pain behaviour.']],
          ['Which is more defensible?', ['Methodological behaviourism makes no claim about the meaning of mental terms, so it is weaker and safer — though cognitive science shows inner states can be studied scientifically after all.', 'Philosophical behaviourism makes strong claims about meaning that face holism (a desire produces behaviour only given beliefs), pretenders and stoics.']],
          ['Smart’s rejection', ['Pains and after-images are inner causes: Jack cries out <i>because</i> he is in pain. A disposition says what would happen; it doesn’t name the occurrent cause.', 'Reporting an after-image reports something going on in me now, not a tendency to behave.', 'Smart keeps materialism another way: the inner cause is a brain process.']],
          ['Conclusion', ['Methodological behaviourism survives as a research method; philosophical behaviourism fails as an account of mental concepts, and Smart’s identity theory takes over its anti-dualist role.']]
        ],
        must: ['Defined both forms correctly and contrasted them', 'Gave an example of behaviourist reinterpretation (Brahms; pain as a disposition)', 'Evaluated which is more defensible, using at least one objection', 'Explained Smart’s inner-cause objection', 'Showed how Smart’s alternative keeps materialism'] },
      { q: '“A vase is fragile because it would break if struck.” Explain how a behaviourist uses this model to analyse “Jack is in pain”. Can such an analysis explain why Jack cries out?',
        plan: [
          ['Thesis', ['The dispositional model lets the behaviourist say “Jack is in pain” is true and explanatory without positing an inner state. But dispositional explanation is too thin to explain the cry, which is why Smart looks for an inner cause.']],
          ['The model', ['Schema: [subject] is [disposition] because [manifestation] if [manifestation condition].', 'Fragility is real and explanatory (“it broke because it was fragile”), but it is not an extra object inside the vase.']],
          ['Applied to pain', ['Jack is in pain = Jack is disposed to wince, cry out, nurse his foot, say “ouch”, accept painkillers… in suitable conditions.', '“Jack is in pain” can be true and explanatory, but not because pain is an inner cause of behaviour.']],
          ['Does it explain the cry?', ['“He cried out because he was in pain” becomes “because he was disposed to cry out when injured” — it fits the event to a pattern, but seems close to saying he cried out because he was the kind of thing that cries out.', 'Dispositions plausibly have a categorical basis (the glass’s molecular structure). For pain, the basis would be a brain state — which pushes towards Smart’s identity theory.']],
          ['Further problems', ['Holism: Jack won’t cry out if he wants to look brave and believes crying is weak, so the conditions mention other mental states.', 'Actors (behaviour without pain) and stoics (pain without behaviour).']],
          ['Conclusion', ['The dispositional analysis gets something right — pain is tied to behaviour — but it can’t supply the occurrent inner cause our explanation of the cry seems to need.']]
        ],
        must: ['Stated the dispositional schema (manifestation plus condition)', 'Applied it to pain with concrete behaviours', 'Discussed whether dispositional explanation is genuinely causal', 'Mentioned the categorical basis or Smart’s inner-cause view', 'Raised the holism or the actor/stoic objection'] }
    ],

    smart: [
      { sample: 1, q: 'Smart claims that the identity theory is an empirical hypothesis. What kinds of evidence could be used to support Smart’s identity theory? Would such evidence conclusively prove the theory? What sorts of evidence would refute it?',
        plan: [
          ['Thesis', ['Smart’s identities (pain = brain state B) are empirical. Neuroscience can support them, but correlation evidence can never conclusively prove identity; evidence of dissociation would refute them.']],
          ['Why empirical', ['“Pain” doesn’t mean “brain state B”: people talk competently about pain without knowing any neuroscience.', 'Like lightning = electrical discharge (or water = H₂O): people recognised lightning long before anyone knew what it was. The identity was discovered.']],
          ['Supporting evidence', ['Brain imaging: B occurs whenever subjects report pain.', 'Lesions: damage that prevents B also prevents pain.', 'Prediction: researchers can tell whether someone is in pain from their neural activity.']],
          ['Not conclusive', ['This evidence shows correlation, which is compatible with other relationships: B causes pain, pain causes B, or a common cause — a dualist with psychophysical laws predicts the same data.', 'Even perfect coextension doesn’t guarantee identity: being a cup of coffee and being a cup of Mary’s favourite drink may apply to the same things, yet they are different properties.', 'So evidence supports the identity (with Occam’s razor) but doesn’t guarantee it.']],
          ['What would refute it', ['Dissociation: pain without B, or B without pain. Identical properties can’t come apart (Leibniz’s law).', 'Other creatures: an octopus plausibly in pain with a nervous system that can’t enter B.', 'Artificial systems with the functional organisation and behaviour of pain but no neurons.']],
          ['Conclusion', ['Being open to refutation is part of what makes the theory empirical. Multiple realisability is its most serious empirical threat.']]
        ],
        must: ['Distinguished identity from definition or meaning (lightning or water)', 'Named concrete supporting evidence (imaging, lesions, prediction)', 'Explained why correlation or coextension isn’t identity', 'Gave refuting evidence: dissociation either way, including other species or AI', 'Linked refutation to Leibniz’s law or the need for coextension'] },
      { sample: 3, q: 'According to Smart, dualism in the philosophy of mind is to be rejected because of “Occam’s Razor”. Drawing on your own understanding of the readings and the seminars, explain Smart’s reasoning.',
        plan: [
          ['Thesis', ['Smart argues that dualism and the identity theory fit the evidence equally, so the simpler theory — the one without non-physical states and psychophysical laws — should be preferred.']],
          ['Occam’s razor', ['Prefer the explanation that requires the fewest assumptions — don’t multiply entities beyond necessity.']],
          ['The causal chain', ['Jack’s foot is injured → nerve signal → C-fibres fire → brain signals chest and throat → Jack cries out. Physical science can in principle explain every link.', 'The dualist must add non-physical pains and psychophysical laws: C-fibres fire → pain → signal.']],
          ['What is wrong with the extras', ['They do no work the physical chain doesn’t already do.', 'Psychophysical laws would be unlike any other scientific law: they would link complex neural processes to simple non-physical items, dangling outside the rest of science.', 'It is implausible that physics explains everything except sensations.']],
          ['Why simplicity, not experiment', ['No experiment decides between the views: every pain–brain correlation the identity theorist cites, the dualist explains with a psychophysical law.', 'So the specific identities are empirical, but the choice between dualism and the identity theory is made on grounds of simplicity.', 'The razor only applies if nothing forces dualism on us — which is why Smart answers the objections: the meaning objection (lightning), and Leibniz’s-law objections (the after-image isn’t yellow; the <i>experience</i> of it is the brain process).']],
          ['Evaluation', ['The razor is a methodological principle: it doesn’t prove dualism false.', 'A dualist may say the theories aren’t equally explanatory, because consciousness — what it is like — is left out of the physical story.', 'Still, absent a cogent argument for dualism, parsimony is a reasonable tie-breaker.']]
        ],
        must: ['Defined Occam’s razor', 'Described the dualist’s extra entities and psychophysical laws (the causal chain)', 'Explained why the dispute can’t be settled by experiment alone', 'Noted the razor applies only if no cogent argument forces dualism (Smart’s replies to objections)', 'Offered some evaluation (is simplicity a guide to truth? does dualism explain consciousness better?)'] },
      { q: 'Explain the logic of identity and Leibniz’s law. How might an opponent use Leibniz’s law to argue against the identity theory, and how could Smart reply?',
        plan: [
          ['Thesis', ['Leibniz’s law is valid: any genuine difference refutes an identity. But the differences opponents cite are differences in how we describe or know our mental states, not differences in the states themselves.']],
          ['Identity and Leibniz’s law', ['Identity is the relation everything has to itself and to no other thing: Clark Kent is Superman — one thing.', 'Leibniz’s law: if x is y, whatever is true of x is true of y. So a single difference shows x is not y.', 'Property identities (“for something to be F is for it to be G”) can be definitions or empirical discoveries; Smart’s are empirical.']],
          ['Leibniz’s-law objections', ['After-images: my after-image is yellowish-orange; no brain process is.', 'Location: brain processes are in the head and can be swift or slow; thoughts and sensations don’t seem to be located like that.', 'Privacy: my sensations are known to me directly and privately; brain processes are public.', 'Knowledge: I know I am in pain without knowing anything about my brain.']],
          ['Smart’s replies', ['After-images: what is identical to the brain process is the <i>experience</i> of having an after-image, and the experience isn’t yellowish-orange. There is no yellow object to locate.', 'Location: we don’t ordinarily locate experiences, but that is a fact about our language; if the identity is true, experiences are in the brain.', 'Privacy reflects how reports work (special first-person access), not a second object.', 'Knowledge: Lois Lane knows Superman can fly without knowing Clark Kent can. “Known by me under this description” isn’t a property of the thing itself, so Leibniz’s law doesn’t apply.']],
          ['Conclusion', ['The law is sound; the objections succeed only if they find a property of the state itself. Smart plausibly shows the standard ones don’t, though the qualitative character of experience remains the hardest case.']]
        ],
        must: ['Defined identity and stated Leibniz’s law correctly', 'Gave at least two Leibniz’s-law objections (colour, location, privacy, knowledge)', 'Gave Smart’s reply to the after-image case (the experience isn’t yellow)', 'Explained why “known under one description” contexts don’t violate the law', 'Evaluated which objection is strongest'] },
      { q: 'Smart insists that pain is not merely correlated with, or caused by, C-fibre firing, but is C-fibre firing. Explain the difference, and why it matters for explaining why Jack cries out when he stubs his toe.',
        plan: [
          ['Thesis', ['Correlation and causation both involve two things and leave room for dualism; identity involves one thing under two names. That is what lets Smart say pain causes the cry without adding anything to the physical chain.']],
          ['Three relations', ['Correlation: pain and C-fibre firing always occur together.', 'Causation: C-fibre firing produces pain, a distinct effect.', 'Identity: one thing, two names — like Clark Kent and Superman, or lightning and electrical discharge.']],
          ['Why the difference matters', ['Correlation and causation are what the dualist says: C-fibres fire, a psychophysical law kicks in, a non-physical pain results, and it causes the signal.', 'With identity, “Jack cries out because he is in pain” and “because his C-fibres fire” are the same explanation in different words — no competing causes, no extra laws.']],
          ['What identity buys', ['Parsimony: Occam’s razor shaves off the non-physical pain and the psychophysical laws.', 'Mental causation: pain causes the cry because it is a physical cause, so Elisabeth’s problem doesn’t arise.', 'It is not elimination: pain is real, and “I am in pain” announces a neurological state.', 'It is not definition: the identity is empirical.']],
          ['Limits', ['Evidence of correlation supports identity but can’t prove it; identity is the simplest hypothesis that explains the correlation.', 'Multiple realisability: if octopuses feel pain without C-fibres, pain can’t be C-fibre firing.']],
          ['Conclusion', ['The identity claim is what makes the theory both economical and able to explain the cry.']]
        ],
        must: ['Distinguished correlation, causation and identity', 'Explained why correlation or causation leaves room for dualism', 'Showed how identity makes the two explanations one (no competing causes)', 'Linked identity to Occam’s razor or to mental causation', 'Noted the identity is empirical, not definitional, and isn’t elimination'] }
    ],

    functionalism: [
      { sample: 4, q: 'Explain the Multiple Realisability argument against the identity theory. How might someone like Smart respond? How might someone who endorses Davidson’s version of the identity theory respond?',
        plan: [
          ['Thesis', ['Multiple realisability refutes type identity in its unrestricted form. Smart can retreat to local identities at a cost; Davidson is untouched, because he only ever claimed token identity.']],
          ['The argument', ['Type identity: pain = C-fibre firing, so anything in pain has C-fibres firing.', 'But pain seems realisable in very different physical systems: octopuses with different nervous systems, possibly aliens or AI.', 'Putnam: the identity theorist needs one physico-chemical state common to every pain-feeling creature — an “ambitious” and implausible hypothesis.', 'So pain is not C-fibre firing; what pains share is a functional role.']],
          ['Smart’s responses', ['Species-specific (local) identities: pain-in-humans = C-fibre firing, pain-in-octopuses = O-fibre firing. Cost: “pain” no longer names one thing all pains share.', 'Disjunctive identity: pain = C-firing or O-firing or… Cost: an open-ended disjunction doesn’t look like a natural kind.', 'Empirical reply: the identity is empirical, so let neuroscience decide — at the right grain, realisers may be more similar than Putnam assumes.', 'Bite the bullet: octopus “pain” is a different but similar state.']],
          ['Davidson’s response', ['Davidson holds token identity only: each pain event is some physical event, but mental types aren’t physical types.', 'He already denies there is one neural pattern everyone (or one person at different times) must share. Multiple realisability is what he expects, not a threat.', 'The cost lies elsewhere: if mental properties aren’t physical properties, are they causally relevant? (Kim.)']],
          ['Conclusion', ['MR damages type identity, not materialism. It pushes towards non-reductive views — functionalism or Davidson’s anomalous monism — which then face the exclusion problem.']]
        ],
        must: ['Stated the MR argument with an example (octopus, alien, AI)', 'Showed why MR contradicts type identity', 'Gave at least one Smart-style reply (species-specific or empirical)', 'Explained Davidson’s token-identity response (MR is no threat)', 'Distinguished type from token identity explicitly'] },
      { q: 'Explain Putnam’s functional-state hypothesis. How does it improve on both behaviourism and the identity theory? Is functionalism committed to materialism?',
        plan: [
          ['Thesis', ['Putnam defines mental states by their causal role in an organism’s functional organisation. This avoids the chauvinism of the identity theory and the holism problem of behaviourism, and is, strictly, neutral on materialism.']],
          ['The hypothesis', ['Pain is a functional state of the whole organism: specified by its relations to sensory inputs, behavioural outputs and other internal states.', 'Formally, the organism is a probabilistic automaton with a machine table; pain is one of its states.', 'Software and hardware: one program, many machines.']],
          ['Better than the identity theory', ['Multiple realisability: humans, octopuses, perhaps aliens. The identity theorist needs one physico-chemical state in all of them — “ambitious” and implausible.', 'Functionalism says what all pain-feelers share: a role.']],
          ['Better than behaviourism', ['Mental states are inner states that cause behaviour; behaviour is evidence, not essence.', 'Definitions may mention other mental states (desire with belief), so holism is no problem.', 'Actors and stoics: the functional state can be absent or present despite behaviour, because other states intervene.']],
          ['Materialism?', ['Putnam: the hypothesis is not incompatible with dualism — a soul could realise the organisation.', 'In practice all known realisers are physical, so functionalists are usually token physicalists; the view is non-reductive (higher-level states).']],
          ['Limits', ['Searle’s Chinese Room: the right organisation may not suffice for understanding.', 'Consciousness: could something have the organisation but no experience?']]
        ],
        must: ['Stated the functional-state hypothesis (inputs, outputs, other internal states)', 'Gave MR as its advantage over the identity theory', 'Gave inner causes and holism as its advantage over behaviourism', 'Answered the materialism question (compatible with dualism in principle)', 'Raised at least one problem for functionalism (e.g. the Chinese Room)'] },
      { q: 'Could an octopus, a silicon-based alien or an AI system be in pain? Compare the answers given by Smart’s identity theory and by Putnam’s functionalism, and assess what this reveals about each theory.',
        plan: [
          ['Thesis', ['Smart’s theory ties pain to a human neural type, so it likely says no to all three — too restrictive (“chauvinist”). Functionalism says yes wherever the right organisation is present — possibly too generous. The truth may lie in what kind of organisation matters.']],
          ['Smart', ['Pain = C-fibre firing (or whatever the human neural type is).', 'Octopus: different nervous system, so strictly not pain — or only a species-specific “octopus pain”. Alien and AI: no neurons, so no pain.', 'Counterintuitive: an octopus recoiling from damage surely could hurt. Smart can bite the bullet or adopt local identities.']],
          ['Putnam', ['Pain = a functional state: caused by damage-type inputs, causing avoidance and protective behaviour, interacting with other states.', 'Octopus: plausibly yes. Alien: yes if the organisation matches. AI: yes in principle, if it realises the right organisation.']],
          ['Assessment', ['Functionalism’s strength: it captures the intuition that what matters is what the state does, and it explains multiple realisability.', 'Its cost: it may be too liberal. Searle’s Chinese Room suggests the right organisation isn’t enough for understanding; it may not be enough for experience either.', 'From lectures: a worm may have experience while a far more intelligent AI system may not. Intelligence and experience can come apart, so functionalism must say which organisation matters.']],
          ['Conclusion', ['The cases show the identity theory draws the line too tightly and functionalism possibly too loosely. Consciousness is where the dispute is hardest.']]
        ],
        must: ['Gave Smart’s answer and its chauvinism cost', 'Gave Putnam’s answer via functional organisation', 'Connected the cases to multiple realisability', 'Raised a worry that functionalism is too liberal (Searle, consciousness)', 'Reached a reasoned verdict'] }
    ],

    searle: [
      { sample: 5, q: 'In the Chinese Room argument, the person inside the room does not understand Chinese, despite being able to produce apparently meaningful output in Chinese. Is this enough to support Searle’s claim that computers cannot think? What further claim(s) does Searle need to arrive at this conclusion?',
        plan: [
          ['Thesis', ['No. On its own the case shows only that the man doesn’t understand. To reach a conclusion about computers Searle needs further premises — and his real conclusion is narrower than “computers cannot think”.']],
          ['The case', ['Searle, knowing no Chinese, follows English rules for manipulating Chinese symbols by shape; his outputs are indistinguishable from a native speaker’s. He implements the program but understands nothing.']],
          ['The gap', ['The conclusion is about computers in general; the case is about one component. The man is like the CPU, and nobody says a CPU understands.', 'Systems reply: perhaps the whole system — man, rulebook, paper — understands.']],
          ['Further claims needed', ['(1) The man is doing exactly what any computer does in running a program, so what holds of him holds of any implementation.', '(2) If the man doesn’t understand, nothing in the system does. Searle: let him memorise the rules — he becomes the whole system and still understands nothing.', '(3) Programs are purely formal (syntactic), minds have content (semantics), and syntax is not sufficient for semantics. This is the premise that generalises the case.', '(4) Brains cause minds: thinking requires causal powers equivalent to the brain’s, which a program alone doesn’t provide. Simulation isn’t duplication.']],
          ['What Searle actually concludes', ['Not “computers cannot think” — we are biological machines, and we think. Rather: nothing thinks <i>solely in virtue of</i> running a program. Strong AI is false; weak AI stands.']],
          ['Evaluation', ['Premise (3) carries the weight and is contested: perhaps meaning arises from the right causal relations to the world (robot reply), or the memorising man hosts a second system that does understand.']]
        ],
        must: ['Described the Chinese Room accurately', 'Identified the gap between “the man doesn’t understand” and “computers can’t think”', 'Stated the syntax/semantics premise', 'Discussed the systems reply and Searle’s memorisation response', 'Noted Searle’s actual conclusion is narrower (programs, not machines)'] },
      { q: 'Outline the systems reply to the Chinese Room argument and Searle’s response to it. Is Searle’s response convincing?',
        plan: [
          ['Thesis', ['The systems reply is the most natural objection; Searle’s internalisation response is strong against the crude version but leaves room for the claim that the memorising man hosts a second, understanding system.']],
          ['The argument', ['The man follows rules for manipulating Chinese symbols, produces fluent Chinese and understands nothing; so running a program isn’t sufficient for understanding.']],
          ['Systems reply', ['The man is just one part — like a CPU. Understanding is a property of the whole system: man, rulebook, scratch paper, room.', 'Compare: no single neuron understands English, but the person does.']],
          ['Searle’s response', ['Let the man memorise the rulebook and do all the work in his head. Now he is the whole system, and he still understands no Chinese.', 'There is nothing in the system that isn’t in him, so if he doesn’t understand, neither does the system. It is also implausible that a man plus bits of paper understands when the man doesn’t.']],
          ['Is it convincing?', ['Critics: memorising the program may create a second “virtual” system in the man’s head. The man implementing it needn’t share its understanding, any more than a computer running two programs makes them one.', 'The neuron analogy shows parts can lack what wholes have; Searle himself treats consciousness as a feature of the brain as a system.', 'So Searle’s response ultimately relies on the syntax/semantics premise: no symbol manipulation, however organised, yields meaning.']],
          ['Conclusion', ['The response shifts the burden back onto syntax vs semantics. If that premise holds, the reply fails; if not, the systems reply survives.']]
        ],
        must: ['Stated the systems reply with the CPU or neuron analogy', 'Gave Searle’s memorisation response', 'Assessed whether the response works (the virtual-system worry)', 'Connected the debate to the syntax/semantics premise', 'Reached a verdict'] },
      { q: 'Explain Searle’s distinction between strong and weak AI, and his claim that syntax is not sufficient for semantics. Would Searle say that a modern large language model understands language? Do you agree?',
        plan: [
          ['Thesis', ['By Searle’s argument an LLM does not understand language just by running its program. Training only writes the rulebook. Whether that is right depends on whether meaning can come from use and from connection to the world.']],
          ['Strong vs weak AI', ['Strong AI: an appropriately programmed computer literally has a mind and understands.', 'Weak AI: computers are tools for studying and simulating minds. Searle accepts weak AI.']],
          ['Syntax and semantics', ['Programs are formal: they operate on symbols by shape.', 'Minds have content: thoughts are <i>about</i> things.', 'Syntax by itself is neither constitutive of nor sufficient for semantics, so programs are not sufficient for minds.']],
          ['Searle on LLMs', ['An LLM manipulates tokens using learned statistical relations. However fluent, that is symbol manipulation.', 'Learning the rules from data rather than having them written by hand changes nothing: the Chinese Room scales up.', 'Simulation is not duplication, and brains cause minds — an LLM would need equivalent causal powers.']],
          ['Objections', ['Systems reply: the whole trained network, not any component, might understand.', 'Meaning as use: perhaps semantics just is the right web of relations among symbols and to the world; multimodal or robotic models add the world (the robot reply). Searle: those inputs are still symbols.', 'From lectures: experience and intelligence come apart (a worm may have experience where a highly capable AI system does not), so an LLM’s competence doesn’t settle whether it understands or experiences.']],
          ['Own view', ['State a position and defend it — e.g. Searle shows fluency isn’t sufficient for understanding, but hasn’t shown what is missing, so the question stays open.']]
        ],
        must: ['Defined strong vs weak AI', 'Explained syntax vs semantics and the structure of the argument', 'Applied the argument to LLMs (training only writes the rulebook)', 'Raised a counter-argument (systems or robot reply; meaning as use)', 'Stated and defended a view of your own'] },
      { q: 'Does the Chinese Room argument refute functionalism? Consider the brain simulator reply in your answer.',
        plan: [
          ['Thesis', ['The Chinese Room is a serious challenge to functionalism but not a refutation: it depends on an intuition that is least reliable exactly where functionalism is most plausible — at the fine-grained organisation of a brain.']],
          ['Functionalism', ['Mental states are defined by functional organisation; anything with the right organisation has the states. If the mind is a program, running it suffices.']],
          ['The challenge', ['The room (or the memorising man) realises the program for understanding Chinese — same inputs, outputs and internal transitions — yet understands nothing. So functional organisation isn’t sufficient for understanding.']],
          ['Brain simulator reply', ['Make the program simulate the actual neuron firings of a Chinese speaker. At that grain, surely the system understands.', 'Searle: implement the same formal structure with water pipes and valves; still no understanding. Simulating the formal structure misses the brain’s causal powers — simulation isn’t duplication.']],
          ['Evaluation', ['Functionalists: the original room only matches coarse input/output, which is not the right organisation. At the fine grain, our intuitions are unreliable — no one can really imagine billions of pipes.', 'Searle owes an account of which causal powers of brains matter. “Brains cause minds” names the problem rather than solving it.', 'Searle’s best support is the syntax/semantics premise, which is itself contested.']],
          ['Conclusion', ['Not a refutation, but a pointed challenge: functionalists must say why organisation, rather than the stuff that realises it, produces meaning.']]
        ],
        must: ['Explained functionalism and why the room seems to have the right organisation', 'Stated the brain simulator reply', 'Gave Searle’s water-pipes response (simulation isn’t duplication)', 'Evaluated (grain of organisation; reliability of intuition; which causal powers)', 'Reached a verdict on “refute”'] }
    ],

    davidson: [
      { sample: 6, q: 'A key feature of Davidson’s non-reductivism is the idea that there are no strict psychological or psychophysical laws. Explain why Davidson thinks this, and why it is important in his argument. Does this mean that mental events or states cannot be physical?',
        plan: [
          ['Thesis', ['Davidson denies strict mental laws because mental attribution answers to norms of rationality that physics doesn’t share. Anomalism is what makes his view non-reductive, and, combined with his other premises, it shows mental events <i>are</i> physical.']],
          ['Strict laws', ['Nomological laws are general, exceptionless and descriptive, and support inductive reasoning.', 'Psychological generalisations (“people who want x and believe doing y gets x tend to do y”) are rough and hold only other things being equal.']],
          ['Why there are none', ['We attribute beliefs and desires according to what makes rational sense given the person’s other attitudes; this is not optional.', 'Rationality is normative — what one should believe — not a description of what always happens; people violate its norms constantly.', 'Physical concepts answer to no such norms, so mental and physical predicates belong to different families and can’t be linked by strict laws.']],
          ['Importance in the argument', ['Davidson’s three principles: causal interaction; causality requires strict laws; no strict mental laws.', 'Without anomalism, the natural view would be type identity via psychophysical laws (reduction). Anomalism blocks reduction by law or definition — it is what makes the view non-reductive.']],
          ['Mental events are physical', ['Laws relate events under descriptions. A mental event that causes a physical event must fall under a strict law — a physical law, under its physical description.', 'So every causally active mental event is a physical event (token identity). Anomalism concerns mental <i>descriptions</i>, not events, and is compatible with — indeed part of the argument for — monism.', 'Supervenience: no mental difference without a physical difference, but no reduction.']],
          ['Evaluation', ['The worry (Kim): if events cause only in virtue of their physical properties, mental properties seem causally idle.']]
        ],
        must: ['Defined strict laws and contrasted them with rough psychological generalisations', 'Explained the role of rationality and normativity in attributing mental states', 'Set out the three principles (the paradox)', 'Explained how laws relating events under physical descriptions resolve it', 'Answered: anomalism concerns properties and descriptions, not events — mental events are physical'] },
      { sample: 7, q: 'A particular event in Sally’s brain can be described both as a neural activation and as her belief that the marble is in the basket. Explain how Davidson uses the possibility of these two descriptions to combine mental–physical identity with the rejection of psychophysical laws. How is his identity theory different from Smart’s?',
        plan: [
          ['Thesis', ['For Davidson identity holds between events, while laws hold between events only under descriptions. So Sally’s belief can be a neural event without any law linking beliefs of that kind to neural events of that kind. This is token identity, unlike Smart’s type identity.']],
          ['Events and descriptions', ['An event is a particular that can be picked out in many ways. The event in Sally’s brain is “neural activation N” and “her belief that the marble is in the basket”: one event, two descriptions (like one man, “Clark Kent” and “Superman”).']],
          ['Identity without laws', ['Causal relations hold between events however described; laws hold only under some descriptions.', 'Under the description “N” the event falls under strict physical laws — that is how it causes Sally to reach for the basket.', 'Under the description “belief that…” it answers to rational norms (it makes sense given what she saw and didn’t see), not laws.', 'So the token is physical, but there is no law linking the type “belief that the marble is in the basket” to any neural type.']],
          ['Why no type identity', ['Another person, or Sally at another time, could hold the same belief with a different neural event. What makes it that belief is its rational role, not its neural pattern.']],
          ['Contrast with Smart', ['Smart: type identity — the kind “pain” is the kind “C-fibre firing”; reductive; identities are empirical; motivated by Occam’s razor.', 'Davidson: token identity only; non-reductive; no psychophysical laws; motivated by a puzzle about causation and laws.', 'Smart focuses on sensations; Davidson on propositional attitudes governed by rationality.', 'Davidson accommodates multiple realisability; Smart struggles with it.']],
          ['Evaluation', ['Davidson keeps causation and avoids reduction, but faces the worry that the mental description is causally idle.']]
        ],
        must: ['Distinguished events from descriptions or properties', 'Explained how the event falls under physical laws via its physical description', 'Explained why the mental description isn’t lawlike (rationality, holism)', 'Identified Davidson’s view as token identity and Smart’s as type identity', 'Noted at least one further contrast (reductive vs non-reductive; MR; sensations vs attitudes)'] },
      { q: 'Explain the distinction between token identity and type identity. Why does Davidson accept one but not the other, and what makes his view non-reductive?',
        plan: [
          ['Thesis', ['Davidson accepts token identity because mental events cause physical events and causation requires laws. He rejects type identity because mental properties are individuated by rational role. The absence of type identities and laws is what makes him non-reductive.']],
          ['The distinction', ['Token identity: every particular mental event is identical to some particular physical event.', 'Type identity: every mental property (kind) is identical to some physical property.', 'Analogy: every coloured thing is a shaped thing, but colour properties aren’t shape properties. Type identity entails token identity, not vice versa.']],
          ['Why token identity', ['Mental events cause physical events; causally related events fall under strict laws; there are no strict mental laws. So mental events must have physical descriptions under which they fall under laws — they are physical events.']],
          ['Why not type identity', ['What makes a state the belief that the sky is blue is its rational role in a person’s psychology, not a neural pattern.', 'No single pattern everyone, or one person at different times, must share. Mental and physical properties belong to different families — not even coextensive.', 'Falsifiable: ML thought-decoding could find shared patterns; so far results are limited.']],
          ['Why non-reductive', ['No type identities means no bridge laws and no definitions — the mental can’t be reduced to the physical.', 'Psychological explanation (giving reasons) stays autonomous.', 'Materialism is kept by token identity plus supervenience: no mental difference without a physical difference.']],
          ['Evaluation', ['Comfortable with multiple realisability, unlike Smart.', 'But if laws involve only physical properties, mental properties look causally idle (Kim).']]
        ],
        must: ['Defined token and type identity (with an analogy or example)', 'Explained Davidson’s argument for token identity (the paradox)', 'Explained why he rejects type identity (rational role; no shared neural pattern)', 'Explained why this is non-reductive (no laws or definitions linking types; supervenience)', 'Raised the epiphenomenalism worry or contrasted with Smart'] },
      { q: 'Davidson claims that the mental is governed by norms of rationality. Explain why this makes psychological explanation different from physical explanation. Is the fact that people often act irrationally an objection to his view?',
        plan: [
          ['Thesis', ['Psychological explanation makes actions rationally intelligible, while physical explanation subsumes events under strict laws. Irrationality is no objection — it confirms that rationality is a norm rather than a law.']],
          ['Psychological explanation', ['It cites reasons: beliefs and desires (propositional attitudes with content) that make an action intelligible.', 'We attribute what makes rational sense given a person’s other attitudes — holistic and not optional. To explain a cat’s behaviour we talk of aims, beliefs and perceptions, not physics.']],
          ['Physical explanation', ['It subsumes events under strict, exceptionless, descriptive laws; it says nothing about what an object should do.']],
          ['The difference', ['“Believe in accordance with your evidence” is a norm (what you should do), not a law (what always happens).', 'So mental and physical concepts answer to different constitutive principles and can’t be linked in strict laws — anomalism.']],
          ['Irrationality', ['People violate rational norms constantly — but a norm isn’t refuted by violation, as a law would be.', 'Irrationality is only recognisable against a background of largely rational attitudes; even someone acting against their best judgement acts for a reason.', 'It supports anomalism: if the mental followed strict laws of rationality there would be psychological laws, and the fact that the norms are broken is part of why there aren’t.']],
          ['Reductionist reply', ['Psychological explanation is a shortcut we use because we don’t know the neurochemistry.', 'Davidson: the categories differ in kind, not in level of detail; the “shortcut” view assumes what is in question. Decoding studies offer a possible test.']]
        ],
        must: ['Explained rationalising explanation via propositional attitudes and reasons', 'Contrasted normative principles with descriptive strict laws', 'Linked this to anomalism (no psychophysical laws)', 'Answered the irrationality question (violation presupposes the norm; acting for a reason)', 'Considered the reductionist “shortcut” reply'] },
      { q: 'Critics argue that Davidson’s anomalous monism makes mental properties causally irrelevant. Explain this objection. How might Davidson, or a defender of his view, respond?',
        plan: [
          ['Thesis', ['If only physical descriptions figure in causal laws, the mental seems to make no causal difference “as mental”. Davidson’s own reply changes the subject; a better reply appeals to counterfactual difference-making, as Yablo does.']],
          ['Davidson’s view', ['Events cause events; causal relations require strict laws; laws relate events only under physical descriptions. Each mental event is a physical event (token identity).']],
          ['The objection', ['The event causes what it does in virtue of its physical properties, since those are what the law covers.', 'Its being a belief that p does no work — the event would have had the same effects if it hadn’t been a belief at all. Mental properties are epiphenomenal.', 'Kim sharpens this with causal closure and exclusion.']],
          ['Responses', ['(1) Davidson: causation is a relation between events, however described. Properties don’t cause, so asking whether an event caused something “as mental” is confused.', '(2) Supervenience: no mental difference without a physical difference, so mental differences always come with causally relevant physical differences.', '(3) Counterfactual or proportional relevance: had Sally not believed the marble was in the basket, she wouldn’t have looked there. The mental property makes a difference (Yablo).']],
          ['Assessment', ['(1) dodges the question of which properties are causally relevant, which is what we care about.', '(2) gives correlation, not causal work.', '(3) is the most promising, but needs a theory of causation on which difference-making suffices.']],
          ['Conclusion', ['The objection is serious; anomalous monism needs supplementing with an account of property-level causal relevance.']]
        ],
        must: ['Explained Davidson’s view (events, descriptions, laws)', 'Stated the epiphenomenalism objection (causal irrelevance “as mental”)', 'Gave Davidson’s extensional-causation reply', 'Gave a further reply (supervenience, counterfactual, proportionality)', 'Evaluated the replies'] }
    ],

    supervenience: [
      { sample: 8, q: 'Explain the concept of supervenience and its significance for materialist theories of the mind. Some philosophers have argued that it is possible for beings to exist that are physically identical to us and yet are “dead” inside — they experience no sensations or feelings of any kind. Using the concept of supervenience, consider whether this possibility would be consistent with materialism.',
        plan: [
          ['Thesis', ['Supervenience — no mental difference without a physical difference — is the minimal commitment of materialism. If “dead inside” duplicates (zombies) were genuinely possible, supervenience would fail, so their possibility is inconsistent with materialism. The materialist must deny it.']],
          ['Supervenience', ['A-properties supervene on B-properties iff there can be no A-difference without a B-difference.', 'Examples: a mosaic’s picture on its tiles; gas temperature on molecular energy; a machine’s computational state on its components.', 'It allows multiple realisability (many tile arrangements, one picture) and is asymmetric.']],
          ['Significance', ['Materialism minimally requires that physical duplicates be mental duplicates.', 'Non-reductive materialists (Davidson) rely on it: dependence without reduction.', 'Limitation: it gives a correlation, not why it holds, and a dualist with necessary psychophysical laws could accept it.']],
          ['Zombies', ['A zombie is a physical duplicate of you with no experience: no physical difference, yet a mental difference.', 'If zombies are possible, consciousness doesn’t supervene on the physical, and materialism is false.']],
          ['Materialist responses', ['Conceivable but not possible: we can conceive of water that isn’t H₂O, but it isn’t possible. A posteriori identities defeat conceivability arguments.', 'Modal strength: if the mental supervened only by the laws of nature, zombies would be possible under different laws — compatible with property dualism, not materialism. Materialism needs supervenience that holds of necessity.', 'Deny real conceivability: if we fully grasped the physical facts, we would see they include experience.']],
          ['Conclusion', ['The genuine possibility of zombies is inconsistent with materialism; the debate turns on whether conceivability shows possibility.']]
        ],
        must: ['Defined supervenience precisely (no A-difference without a B-difference)', 'Explained why it is treated as the minimal commitment of materialism', 'Showed that possible zombies would violate supervenience', 'Distinguished conceivability from possibility (water and H₂O)', 'Noted supervenience alone doesn’t explain why the dependence holds or isn’t sufficient for materialism'] },
      { q: 'Distinguish reductive from non-reductive materialism. Using examples, explain why someone might resist the reduction of the mental while still accepting materialism.',
        plan: [
          ['Thesis', ['Both hold that the mental is physical; they differ on whether mental properties can be fully explained in physical terms. Consciousness, rationality and multiple realisability give reasons to resist reduction, and supervenience keeps the view materialist.']],
          ['Levels and reduction', ['Not everything is equally fundamental: societies depend on people, people on cells, cells on atoms.', 'Reductive explanation explains what something is in terms of more fundamental stuff: temperature is molecular energy, water is H₂O, life is complex biochemistry.', 'Layer cake: on reductivism, in a sense only the bottom layer is real. Reductive materialism about mind: mental types are physical types (Smart).']],
          ['Non-reductive materialism', ['Mental phenomena are physical, but mental properties are real and irreducible — distinct but not unrelated layers. Davidson, functionalism.']],
          ['Reasons to resist reduction', ['Consciousness: there is something it is like to be you, nothing it is like to be an electron. Reduction seems to lose it, much as many feel something is lost when life is called chemistry.', 'Reason: psychological explanation is normative (Davidson); we explain a cat with aims and beliefs, not physics.', 'Multiple realisability: mental types are realised by many physical types (Putnam).']],
          ['Staying materialist', ['Supervenience: no mental difference without a physical difference; every concrete particular is physical.']],
          ['Evaluation', ['Kim: irreducible mental properties lose their causal powers. Reductionists: irreducibility is only an epistemic shortcut.']]
        ],
        must: ['Defined reductive explanation with examples (water, temperature, life)', 'Defined non-reductive materialism and its commitments', 'Gave at least two reasons to resist reduction (consciousness, reason, MR)', 'Explained how supervenience keeps the view materialist', 'Raised Kim’s challenge or the “shortcut” reply'] },
      { q: 'Distinguish weak from strong emergence. Is consciousness a plausible candidate for strong emergence, and why does Kim think strong emergence is incompatible with materialism?',
        plan: [
          ['Thesis', ['Weak emergence is epistemic and harmless; strong emergence posits genuinely new properties with causal powers. Consciousness is the most tempting candidate, but Kim argues strong emergence conflicts with causal closure.']],
          ['Emergence', ['Complex systems display properties novel relative to their parts: locust swarms; capabilities of artificial neurons in combination.', 'Weak: an epistemological matter — unpredictable only because of our cognitive limits. Uncontroversial.', 'Strong: a metaphysical matter — genuinely new at higher levels, with real causal powers. Highly controversial.']],
          ['Consciousness as a candidate', ['Experience seems underivable even in principle from physical facts (what it is like; the conceivability of zombies).', 'Some think strong emergence is everywhere (life, consciousness); Kim thinks it is incoherent.', 'What would convince us: evidence of real, novel causal powers at the higher level.']],
          ['Kim’s argument', ['A strongly emergent property would cause physical effects not fully caused by its physical base.', 'Causal closure: every physical event with a sufficient cause has a sufficient physical cause. So the emergent cause is either redundant (overdetermination or exclusion) or closure is violated.', 'Closure is a core commitment of materialism, so strong emergence is incompatible with materialism. Kim argues non-reductive physicalism collapses into emergentism and inherits the problem.']],
          ['Evaluation', ['What counts as “physical”? If it includes emergent properties, closure becomes trivial.', 'Epiphenomenal emergence avoids the conflict but faces Fodor’s worry.', 'Perhaps apparent strong emergence is only an epistemic limitation (the Week 4 discussion).']]
        ],
        must: ['Defined weak vs strong emergence with an example', 'Explained why strong emergence is controversial (novel causal powers)', 'Assessed consciousness as a candidate', 'Explained the conflict with causal closure', 'Considered a response (what counts as physical; epiphenomenal emergence)'] }
    ],

    kim: [
      { sample: 9, q: 'Suppose a desire for water is realised by a neural state, and the neural state is sufficient to cause a person’s arm to reach for a glass. Explain why, according to Kim, this creates a causal exclusion problem for non-reductive materialism. How might a non-reductivist (e.g., Yablo) respond?',
        plan: [
          ['Thesis', ['Given closure and exclusion, the neural state leaves the desire nothing to do, so the non-reductivist must reduce or accept epiphenomenalism. Yablo replies that desire and neural state are determinable and determinate, which don’t compete — and the desire may be the more proportional cause.']],
          ['Set-up', ['Non-reductive materialism: the desire D is real and irreducible, realised by neural state N.', 'N is sufficient for the reaching R.']],
          ['Kim’s argument', ['(1) Mental causation: D causes R.', '(2) Irreducibility: D ≠ N.', '(3) Closure: R has a sufficient physical cause, namely N.', '(4) Exclusion: no event has more than one sufficient cause unless genuinely overdetermined.', '(5) No systematic overdetermination.', 'C: D is excluded — reduce it (D = N) or accept it is epiphenomenal. Only reductive materialism makes sense of mental causation; Elisabeth’s problem returns.']],
          ['Why it matters', ['Fodor: without mental causation, practically everything we believe is false. And the argument generalises to every special science.']],
          ['Yablo’s response', ['D and N are not rivals: D is a determinable of which N is a determinate, as red is to scarlet. Being scarlet doesn’t make being red causally idle.', 'Exclusion is plausible only for independent causes (two assassins), not for a determinable and its determinate.', 'Proportionality: the reaching would have occurred with any realiser of the desire (N′, N″), so D is proportional to R and N contains irrelevant detail. If anything, D is the better cause.']],
          ['Evaluation', ['Requires that the mental–physical relation really is determinable–determinate, and that proportionality is metaphysical rather than epistemic.', 'Kim: the determinable has no causal powers beyond those of its determinates, so it adds nothing.']]
        ],
        must: ['Laid out Kim’s premises (closure, exclusion, irreducibility, no overdetermination)', 'Applied them to the desire / neural state / reaching example', 'Stated the dilemma: reduction or epiphenomenalism', 'Explained Yablo’s determinable–determinate move and proportionality', 'Evaluated Yablo’s response (is the analogy apt? is proportionality metaphysical?)'] },
      { q: 'Explain the principle of the causal closure of the physical. Why does Kim regard it as a core commitment of materialism, and how does it figure in his argument against non-reductive physicalism?',
        plan: [
          ['Thesis', ['Closure says physical effects never need non-physical causes. It expresses the materialist’s confidence in physics, and in Kim’s argument it guarantees that every behavioural effect already has a physical sufficient cause.']],
          ['Statement', ['Every physical event that has a sufficient cause has a sufficient physical cause.', 'It allows uncaused physical events, but tracing back the causal history of a physical event we never have to appeal to anything non-physical.', 'Ancestors: “nothing comes out of nothing”; “every effect must have a sufficient cause at least as real as itself” (used by Descartes to argue for God).']],
          ['Why it is core', ['If closure failed, some physical events would need non-physical causes — the dualist’s picture.', 'Like Occam’s razor: given closure, what need is there for non-physical substances? It underwrites Smart’s confidence that the whole causal chain is physical.']],
          ['Role in Kim’s argument', ['Non-reductivism: the mental property M is irreducible and realised by P; M causes behaviour B.', 'Closure: B has a sufficient physical cause, P.', 'Exclusion and no systematic overdetermination: P excludes M.', 'So reduce M to P, or accept that M is epiphenomenal.']],
          ['Open questions', ['What is “physical”? Kim seems to mean fundamental physics; then neuroscience’s properties are excluded too (the generalisation worry).', 'What counts as a sufficient cause?']],
          ['Responses', ['Most non-reductivists keep closure and reject exclusion instead (Yablo: determinables and determinates don’t compete).']]
        ],
        must: ['Stated closure precisely (sufficient cause → sufficient physical cause)', 'Explained why it is central to materialism (and its link to Occam’s razor)', 'Showed where it enters Kim’s exclusion argument', 'Raised the “what is physical / sufficient cause” questions', 'Noted possible responses (deny exclusion rather than closure — Yablo)'] },
      { q: 'Kim’s exclusion argument seems to threaten not only mental causation but the causal claims of every science other than fundamental physics. Explain this worry. Does it give the non-reductivist a good reason to reject Kim’s argument?',
        plan: [
          ['Thesis', ['The exclusion reasoning applies to any realised property, so it seems to drain causal power from biology, economics and common sense. That makes it look like a reductio — unless Kim can show special-science properties reduce in a way mental ones don’t.']],
          ['The argument', ['Irreducible M, realised by P; P is sufficient for the effect (closure); exclusion and no overdetermination leave M idle.']],
          ['Generalisation', ['Replace M with any higher-level property: a virus causing illness, inflation causing unrest, a brick breaking a window.', 'Each is realised by lower-level properties that are sufficient for the effect, so each is excluded, and causal power “drains” down to fundamental physics.', 'If there is no bottom layer, causation might drain away altogether.']],
          ['Reductio?', ['If the argument proves only physics has causes, something has gone wrong — biology and common sense are not systematically false.', 'The likely culprit is exclusion as applied to realised and realiser. Yablo: the brick and its particles don’t compete; determinables and determinates don’t compete.']],
          ['Kim’s reply', ['Special-science properties may be functionally reducible — identified with their realisers in each case — and so keep their causal powers by identity.', 'The argument targets only irreducible properties, so the generalisation is a reason to reduce, not to give up.']],
          ['Verdict', ['If the non-reductivist can say why biology’s causal claims are acceptable without reduction, the same account helps psychology — so the worry shifts the burden back to Kim.']]
        ],
        must: ['Summarised the exclusion argument', 'Explained how it generalises to the special sciences and common sense, with examples', 'Considered the “proves too much” (reductio) response', 'Gave a possible Kim reply (reduction of special-science properties)', 'Reached a verdict on whether it undermines Kim'] },
      { q: 'Materialists have generally thought that mental causation was a problem for dualists only. Explain Elisabeth of Bohemia’s challenge to Descartes and Kim’s challenge to non-reductive physicalism. To what extent are they the same problem?',
        plan: [
          ['Thesis', ['Both ask how something distinct from the physical can make a physical difference, and both are solved by identity. But Elisabeth’s is a problem of intelligibility for substances, while Kim’s is a problem of redundancy for properties.']],
          ['Elisabeth', ['Thinking causally influences matter and vice versa. In a mechanical world causation needs contact and extension; the Cartesian mind is unextended. So dualism is incomplete, and the mind risks being a ghost.']],
          ['The materialist answer', ['Smart: mental states are brain states, so they cause as brain states do. Davidson: mental events are physical events.']],
          ['Kim', ['Non-reductive physicalism keeps distinct mental properties. With closure, exclusion and no systematic overdetermination, the realiser does all the work, so the mental property is idle.', 'Kim: non-reductivists face a problem materialists thought belonged only to dualists.']],
          ['Similarities', ['Both concern difference-making by something not identical to the physical.', 'Both are pressed by a picture of physics as complete (mechanism; closure).', 'Both are solved by identity.']],
          ['Differences', ['Elisabeth asks <i>how</i> interaction could work (no contact); Kim grants that there is a mechanism but says the mental property is redundant.', 'Cartesian minds are independent substances; non-reductive mental properties supervene on and are realised by the physical — which gives non-reductivists resources Descartes lacked (Yablo’s determinables).']],
          ['Conclusion', ['The same family of problem, not the same problem. Its recurrence shows that mental causation is the central test for any theory of mind.']]
        ],
        must: ['Stated Elisabeth’s challenge', 'Stated Kim’s argument with closure and exclusion', 'Identified a genuine similarity (difference-making by the non-identical)', 'Identified a genuine difference (intelligibility vs redundancy; dependence)', 'Concluded on “same problem?”'] }
    ],

    yablo: [
      { sample: 10, q: 'Sophie the pigeon has been trained to peck at red objects. She is shown a scarlet chip and pecks at it. Explain why Yablo thinks that the chip’s being red is a better candidate for the cause of the pecking than its being scarlet. How is this supposed to defend the causal relevance of mental properties, and what would have to be true for the analogy between mental properties and determinables to succeed?',
        plan: [
          ['Thesis', ['Redness is the proportional cause of the pecking: required, and enough, with no irrelevant detail. If mental properties are determinables of their neural realisers, they can likewise be the proportional causes of behaviour. But that needs the determinable model to fit, and proportionality to be metaphysical.']],
          ['Determinables and determinates', ['Colour → red → scarlet, from less to more determinate. Being scarlet is a specific way of being red, and anything scarlet must be red.', 'Determinables and their determinates don’t compete: being scarlet doesn’t make being red idle.']],
          ['Sophie', ['She was trained on red: she would have pecked at a crimson or maroon chip too, and not at a blue one.', 'Redness is required (take it away and she doesn’t peck) and enough (any red will do). Scarlet adds detail that made no difference; “coloured” is too unspecific.', 'Proportionality: the cause is neither too specific nor too unspecific.']],
          ['The defence of mental causation', ['Mental properties (wanting water, being in pain) are determinables; their neural realisers N₁, N₂… are determinates.', 'The behaviour would have followed from any realiser, so the mental property is proportional to it and the realiser is too specific.', 'So the mental property is causally relevant and Kim’s exclusion doesn’t apply: determinable and determinate aren’t competing causes. Proportionality is meant metaphysically — about what the cause really is.']],
          ['What must be true', ['(1) The mental–physical relation must really be determinable–determinate: realisers must necessitate the mental property (as scarlet necessitates red) and be ways of having it. Yet determinates usually vary along a shared dimension (hue, saturation), while neural states and pains look like different families (Davidson).', '(2) Proportionality must be a genuine constraint on causation, not merely on explanation.', '(3) The effect must not be sensitive to the specific realiser: describe it finely (an exact motor pattern) and the realiser may be proportional.']],
          ['Conclusion', ['A clever defence, but it rests on contested metaphysics.']]
        ],
        must: ['Explained determinable / determinate with the colour example', 'Explained proportionality using Sophie (any red chip; scarlet adds irrelevant detail; “coloured” too unspecific)', 'Applied it to mental properties and their neural realisers', 'Explained how this blocks Kim’s exclusion (no competition)', 'Stated conditions for success (realisers as determinates; proportionality metaphysical; effect not realiser-sensitive)'] },
      { q: 'Yablo claims that macro-properties and their realisers do not compete for causal relevance. Explain this claim using the example of a brick breaking a window and the determinable–determinate relation. Does it show that Kim’s exclusion principle is false?',
        plan: [
          ['Thesis', ['The brick case shows that realised and realising properties aren’t rival causes, so the exclusion principle is false in its unrestricted form. But that alone doesn’t show the mental property does causal work of its own.']],
          ['Kim’s exclusion principle', ['No event has more than one sufficient cause unless it is genuinely overdetermined; if one sufficient cause does the work, there is none left for the other.']],
          ['The brick', ['The brick breaks the window; the particles composing it are also sufficient.', 'We don’t think the window was broken twice (overdetermination), nor that the brick was idle.', 'Why not? The brick’s properties (mass, momentum) are realised by its particles’ properties — they aren’t independent.']],
          ['Determinables', ['Colour → red → scarlet. Being scarlet is a way of being red; it necessitates red; they don’t compete.', 'Exclusion is plausible only for independent causes (two assassins). Determinable and determinate aren’t independent, so exclusion doesn’t apply.', 'Proportionality then decides which is the cause: sometimes the determinable (Sophie and red).']],
          ['Does exclusion fail?', ['The unrestricted principle fails: it must be restricted to independent causes.', 'Kim: the determinable has no causal powers beyond those of its determinates (it inherits them), so it adds nothing — non-competition isn’t causal work.', 'And is the mental–physical relation really determinable–determinate?']],
          ['Conclusion', ['Yablo weakens exclusion; whether that saves mental causation depends on the analogy and on proportionality being metaphysical.']]
        ],
        must: ['Stated Kim’s exclusion principle', 'Used the brick example to show non-competition', 'Explained determinable / determinate (red and scarlet)', 'Argued that exclusion holds only for independent causes', 'Considered Kim’s “causal inheritance” reply or whether the model fits the mind'] },
      { q: 'Is proportionality a metaphysical constraint on causation, or merely an epistemic or pragmatic constraint on explanation? Why does the answer matter for Yablo’s defence of non-reductive materialism?',
        plan: [
          ['Thesis', ['Only a metaphysical reading lets proportionality answer Kim. On an epistemic reading mental properties figure in good explanations but don’t cause anything. Which reading is right depends on what causation is.']],
          ['Proportionality', ['A cause should be neither too specific nor too unspecific. Sophie pecks because the chip is red, not because it is scarlet or merely coloured.']],
          ['Metaphysical reading', ['Facts about what causes what include proportionality: red really is the cause, and scarlet isn’t.', 'Then mental properties really cause behaviour, and realisers are too specific — Kim’s exclusion is answered and Fodor’s worry dissolved.']],
          ['Epistemic or pragmatic reading', ['Proportionality reflects what information is relevant or useful to us.', 'The real cause is the complete physical state; we cite “red” or “pain” because we don’t need or know the detail — the reductionist’s shortcut.', 'Then Yablo concedes Kim’s point: mental properties explain, but don’t cause.']],
          ['Deciding', ['Difference-making (counterfactual) views of causation favour the metaphysical reading: had the chip been crimson she would still have pecked, so scarlet made no difference.', 'Production views (causation as transfer of energy) favour micro-physical causes, making proportionality look explanatory only.']],
          ['Conclusion', ['Yablo’s defence stands or falls with a difference-making conception of causation — state and defend your own verdict.']]
        ],
        must: ['Explained proportionality with an example', 'Distinguished the metaphysical from the epistemic reading', 'Explained why only the metaphysical reading answers Kim', 'Linked the question to a view of causation (difference-making vs production)', 'Gave a reasoned verdict'] }
    ]
  };

  /* ============================== builders ============================== */

  function shuffleChoice(rng, options, correctIdx) {
    var idx = rng.shuffle(options.map(function (_, i) { return i; }));
    return { options: idx.map(function (i) { return options[i]; }), correct: idx.indexOf(correctIdx) };
  }

  /* Deal questions from a shuffled deck per bank, so practice works through
     every question before any repeats. */
  var decks = {};
  function deal(key, n, rng) {
    if (!decks[key] || !decks[key].length) {
      var all = [];
      for (var i = 0; i < n; i++) all.push(i);
      decks[key] = rng.shuffle(all);
    }
    return decks[key].pop();
  }

  function mcPart(rng, item, label) {
    var sh = shuffleChoice(rng, item.o, 0);
    return { kind: 'choice', label: label || '', marks: 1, prompt: item.q,
             options: sh.options, correct: sh.correct, solution: item.why };
  }

  var PROSE_NOTE = '<p><i>Dot-point plan for learning. In the test, write it as connected prose — the handout says it expects coherent philosophical writing, not a list of bullet points.</i></p>';

  function planHtml(plan) {
    return plan.map(function (sec) {
      return '<h5>' + sec[0] + '</h5><ul>' +
        sec[1].map(function (p) { return '<li>' + p + '</li>'; }).join('') + '</ul>';
    }).join('');
  }

  function sampleTag(e) {
    return e.sample ? '<p class="small muted">Sample question ' + e.sample + ' from the In-class Test 1 handout.</p>' : '';
  }

  var ESSAY_PROMPT = 'Write a mini-essay of up to 500 words. Aim for a clear thesis, an explanation of the view, an objection or complication, and a reasoned verdict. (Or sketch a plan first, then compare it with the model.)';

  function essayPart(e, label) {
    return { kind: 'written', label: label || '', marks: 10, prompt: ESSAY_PROMPT,
             model: PROSE_NOTE + planHtml(e.plan), checklist: e.must,
             wordLimit: 500, rows: 14, placeholder: 'Write your answer here, in prose…' };
  }

  var TEMPLATES = [];
  TOPICS.forEach(function (t) {
    TEMPLATES.push({
      id: 'mc-' + t.key, topic: t.name, format: 'Multiple choice',
      title: t.name + ': multiple choice', marks: 1, guide: GUIDES[t.key],
      build: function (rng) {
        var bank = MCQ[t.key];
        return { intro: '', data: [], parts: [mcPart(rng, bank[deal('mc-' + t.key, bank.length, rng)])] };
      }
    });
    TEMPLATES.push({
      id: 'er-' + t.key, topic: t.name, format: 'Extended response',
      title: t.name + ': extended response', marks: 10, guide: GUIDES[t.key],
      build: function (rng) {
        var bank = ESSAYS[t.key];
        var e = bank[deal('er-' + t.key, bank.length, rng)];
        return { intro: '<p>' + e.q + '</p>' + sampleTag(e), data: [], parts: [essayPart(e)] };
      }
    });
  });

  /* Standard builder from _template.js. */
  function build(templateId, seed) {
    var tpl = null, i;
    for (i = 0; i < TEMPLATES.length; i++) if (TEMPLATES[i].id === templateId) tpl = TEMPLATES[i];
    if (!tpl) return null;
    for (var k = 0; k < 60; k++) {
      var rng = global.Stats.rng(seed + k * 7919);
      var q;
      try { q = tpl.build(rng); } catch (e) { q = null; }
      if (q) {
        q.id = tpl.id; q.topic = tpl.topic; q.title = tpl.title;
        q.marks = q.parts.reduce(function (s, p) { return s + (p.marks || 0); }, 0);
        q.seed = seed + k * 7919;
        return q;
      }
    }
    return null;
  }

  /* ============================== mock test ==============================
     The real test's shape: Section A, ten multiple-choice questions (one from
     every topic plus one extra, in course order); Section B, one mini-essay
     chosen from three, drawn from three different topics. */

  function buildMock() {
    var rng = global.Stats.rng(Math.floor(Math.random() * 1e9));

    var order = TOPICS.slice();
    var extra = rng.pick(TOPICS);
    order.splice(TOPICS.indexOf(extra) + 1, 0, extra);
    var used = {};
    var mcParts = order.map(function (t, i) {
      var bank = MCQ[t.key], idx;
      for (var tries = 0; tries < 8; tries++) {
        idx = deal('mc-' + t.key, bank.length, rng);
        if (!used[t.key + idx]) break;
      }
      used[t.key + idx] = true;
      var p = mcPart(rng, bank[idx], (i + 1) + '.');
      p.topic = t.name; p.tpl = 'mc-' + t.key;   // file the result under its own topic
      return p;
    });
    var sectionA = {
      id: 'mock-mc', topic: 'Weeks 1–4', title: 'Multiple choice', examLabel: 'Section A',
      marks: mcParts.length, intro: '<p>Answer all ten questions. Each is worth 1 mark.</p>',
      data: [], parts: mcParts, seed: 0
    };

    var topics = rng.shuffle(TOPICS).slice(0, 3).sort(function (a, b) {
      return TOPICS.indexOf(a) - TOPICS.indexOf(b);
    });
    var essays = topics.map(function (t) {
      var bank = ESSAYS[t.key];
      return bank[deal('er-' + t.key, bank.length, rng)];
    });
    var model = PROSE_NOTE + essays.map(function (e, i) {
      return '<p style="margin-top:14px"><b>If you answered question ' + (i + 1) + '</b></p>' + planHtml(e.plan) +
        '<p><b>A marker would look for:</b></p><ul>' + e.must.map(function (m) { return '<li>' + m + '</li>'; }).join('') + '</ul>';
    }).join('');
    var part = {
      kind: 'written', label: '', marks: 10, wordLimit: 500, rows: 16,
      prompt: 'Write a mini-essay of up to 500 words answering <b>one</b> of the three questions. Start by noting which one you chose.',
      placeholder: 'Question 2. …', model: model,
      topic: 'Mock test essay', tpl: 'Mock test essay'
    };
    var sectionB = {
      id: 'mock-essay', topic: 'Mock test essay', title: 'Extended response', examLabel: 'Section B',
      marks: 10,
      intro: '<p>Answer <b>one</b> of the following three questions. The marker expects coherent philosophical writing, not a list of bullet points or disconnected statements.</p><ol>' +
        essays.map(function (e) { return '<li style="margin:6px 0">' + e.q + '</li>'; }).join('') + '</ol>',
      data: [], parts: [part], seed: 0
    };
    return [sectionA, sectionB];
  }

  /* ============================ drill + reference ============================ */

  var TERMS = [
    { tag: 'Week 1 · Dualism', q: 'Aristotle’s “soul”', a: 'The form of a living body: its parts and their organisation, which give it capacities — nutrition (plants), perception and self-movement (animals), reason and speech (humans).' },
    { tag: 'Week 1 · Dualism', q: 'The scientific revolution’s picture of matter', a: 'Uniformity: one material substance whose nature is extension (taking up space). Corollary: physics is maths.' },
    { tag: 'Week 1 · Dualism', q: 'Substance (Descartes)', a: 'Either a type of stuff or an individual thing. Has properties (modes, qualities, attributes): essential (defining) or accidental (optional).' },
    { tag: 'Week 1 · Dualism', q: 'Substance dualism', a: 'My essence is thinking; the essence of body is extension; things that differ in essence are different substances; so I am distinct from any body.' },
    { tag: 'Week 1 · Dualism', q: 'Dualism vs the three monisms', a: 'Dualism: distinct mental and material realities. Monism: materialism (all material), idealism (all mental — Leibniz, Berkeley), neutral monism (neither — Spinoza, Russell).' },
    { tag: 'Week 1 · Dualism', q: 'Elisabeth’s objection', a: 'Thinking causally influences, and is influenced by, matter. Pushing needs contact and extension; the mind is unextended. Dualism owes an account of interaction — otherwise the mind is a ghost.' },
    { tag: 'Week 1 · Behaviourism', q: 'Ontological commitment', a: '“There’s a burglar” commits you to a burglar existing. Do reports of pains and after-images commit us to non-physical things?' },
    { tag: 'Week 1 · Behaviourism', q: 'Methodological behaviourism', a: 'Psychological talk isn’t part of science, so set it aside: the mind is a black box; science establishes reliable input/output correlations.' },
    { tag: 'Week 1 · Behaviourism', q: 'Radical / philosophical behaviourism', a: 'Reinterpret psychological concepts in terms of behaviour and dispositions (or discard them as empty). “I like Brahms” → Brahms’ music reinforces me.' },
    { tag: 'Week 1 · Behaviourism', q: 'Eliminative materialism', a: 'Psychological ways of speaking should go; reform our language so we don’t talk about such things.' },
    { tag: 'Week 1 · Behaviourism', q: 'Disposition schema', a: '[subject] is [disposition] because [manifestation] if [manifestation condition]. A vase is fragile because it would break if struck.' },
    { tag: 'Week 1 · Behaviourism', q: 'Operant conditioning', a: 'Behaviour is shaped by its consequences: reinforced or extinguished. Behaviourism’s lasting legacy; the basis of reinforcement learning in AI.' },
    { tag: 'Week 1 · Identity theory', q: 'Occam’s razor', a: 'Choose the simplest explanation — the one requiring the fewest assumptions.' },
    { tag: 'Week 1 · Identity theory', q: 'Smart’s identity theory', a: 'Mental states are brain states: pain IS C-fibre firing — not correlated with it or caused by it. An empirical (not definitional), type, reductive identity.' },
    { tag: 'Week 1 · Identity theory', q: 'Identity', a: 'The relation everything has to itself and to no other thing. Clark Kent is Superman: one thing, not two.' },
    { tag: 'Week 1 · Identity theory', q: 'Leibniz’s law', a: 'If x is y, whatever is true of x is true of y, and vice versa. One difference refutes an identity.' },
    { tag: 'Week 1 · Identity theory', q: 'Empirical vs definitional identity', a: 'Water = H₂O and lightning = electrical discharge were discovered, not read off meanings. Smart’s mental/brain identities are empirical — you can use “pain” competently knowing no neuroscience.' },
    { tag: 'Week 2 · Functionalism', q: 'Functional state', a: 'A state defined by its causal role: relations to sensory inputs, behavioural outputs and other internal states (Putnam: a state of a probabilistic automaton).' },
    { tag: 'Week 2 · Functionalism', q: 'Multiple realisability', a: 'One mental type can be realised by many physical types (human, octopus, alien, machine). An argument against type identity, not against materialism.' },
    { tag: 'Week 2 · Chinese Room', q: 'Strong vs weak AI', a: 'Strong: the right program literally has a mind and understands. Weak: computers are tools for studying minds. Searle attacks only strong AI.' },
    { tag: 'Week 2 · Chinese Room', q: 'Syntax vs semantics', a: 'Programs are formal (syntax: shapes of symbols); minds have content (semantics: meaning). Syntax alone is not sufficient for semantics.' },
    { tag: 'Week 2 · Chinese Room', q: 'Systems / robot / brain simulator replies', a: 'Systems: the whole room understands → memorise the rules. Robot: add cameras and arms → just more symbols. Brain simulator: simulate neurons → water pipes still don’t understand.' },
    { tag: 'Week 2 · Chinese Room', q: 'Simulation vs duplication', a: 'A simulated rainstorm leaves nobody wet. Simulating understanding isn’t understanding. Brains cause minds — via causal powers, not programs.' },
    { tag: 'Week 3 · Anomalous monism', q: 'Davidson’s three principles', a: '(1) Mental events causally interact with physical events. (2) Causally related events fall under strict laws. (3) There are no strict psychological or psychophysical laws.' },
    { tag: 'Week 3 · Anomalous monism', q: 'Law of nature vs human law', a: 'Nomological: general, exceptionless, descriptive, supports induction. Human laws: normative — what you should or shouldn’t do.' },
    { tag: 'Week 3 · Anomalous monism', q: 'Propositional attitudes', a: 'Believe, know, hope, intend, desire, fear… that p. They have content (intentionality), expressed with a “that…” clause.' },
    { tag: 'Week 3 · Anomalous monism', q: 'Token vs type identity', a: 'Token: every mental event is some physical event (every coloured thing is a shaped thing). Type: every mental property is a physical property (every colour property is a shape property). Davidson: token yes, type no.' },
    { tag: 'Week 3 · Anomalous monism', q: 'Anomalous monism', a: 'Monism: every mental event is a physical event. Anomalous: no strict psychophysical laws, because mental properties aren’t physical properties.' },
    { tag: 'Week 3 · Supervenience', q: 'Supervenience', a: 'A supervenes on B iff there can be no A-difference without a B-difference. Physical duplicates are mental duplicates. Allows multiple realisability; asymmetric.' },
    { tag: 'Week 3 · Supervenience', q: 'Reductive vs non-reductive materialism', a: 'Reductive: the mental is fully explained by (identical to) the physical — Smart. Non-reductive: the mental is physical but not fully reductively explicable — Davidson; reasons: consciousness and reason.' },
    { tag: 'Week 4 · Causal exclusion', q: 'Weak vs strong emergence', a: 'Weak: epistemic — unpredictable only given our cognitive limits (uncontroversial). Strong: metaphysical — genuinely new, with real causal powers (highly controversial; Kim: incoherent).' },
    { tag: 'Week 4 · Causal exclusion', q: 'Causal closure of the physical', a: 'Every physical event that has a sufficient cause has a sufficient physical cause.' },
    { tag: 'Week 4 · Causal exclusion', q: 'Sufficient cause / overdetermination', a: 'Sufficient: enough to guarantee the effect. Overdetermination: an effect with more than one sufficient cause.' },
    { tag: 'Week 4 · Causal exclusion', q: 'Kim’s exclusion argument (one line)', a: 'If M ≠ P and P is a sufficient physical cause (closure), then M is excluded unless there is systematic overdetermination — so reduce M to P, or accept that M is epiphenomenal.' },
    { tag: 'Week 4 · Proportionality', q: 'Determinable / determinate', a: 'Colour → red → scarlet. Being scarlet is a specific way of being red. Determinables and determinates don’t compete.' },
    { tag: 'Week 4 · Proportionality', q: 'Proportionality', a: 'A cause should be neither too unspecific nor too specific. Sophie pecks because the chip is red — not because it is scarlet, nor merely coloured.' }
  ];

  var WHO = [
    { tag: 'Who argues what', q: 'Aristotle', a: 'The soul is the form of a living body; all living things have souls; souls can’t exist without bodies.' },
    { tag: 'Who argues what', q: 'Descartes', a: 'Substance dualism: mind = thinking substance, body = extended substance. Bodies (and animals) are machines.' },
    { tag: 'Who argues what', q: 'Elisabeth of Bohemia', a: 'How can an unextended thinking substance move, or be moved by, the body? Dualism is incomplete without an answer.' },
    { tag: 'Who argues what', q: 'Skinner', a: 'Behaviourism: reinterpret mental talk via reinforcement (“I like Brahms” = Brahms reinforces me); operant conditioning.' },
    { tag: 'Who argues what', q: 'Smart', a: 'Identity theory: sensations are brain processes; empirical identities like lightning = discharge; Occam’s razor against dualism.' },
    { tag: 'Who argues what', q: 'Putnam', a: 'Pain is a functional state, not a brain state or a behaviour disposition. Multiple realisability makes the brain-state hypothesis “ambitious”.' },
    { tag: 'Who argues what', q: 'Searle', a: 'Chinese Room: running a program isn’t sufficient for understanding; syntax isn’t semantics; brains cause minds.' },
    { tag: 'Who argues what', q: 'Davidson', a: 'Anomalous monism: token identity without type identity; no strict psychophysical laws because the mental answers to rationality; supervenience without reduction.' },
    { tag: 'Who argues what', q: 'Kim', a: 'Causal closure plus exclusion: non-reductive physicalism can’t make sense of mental causation; reduce or accept epiphenomenalism. Strong emergence is incoherent.' },
    { tag: 'Who argues what', q: 'Fodor', a: 'If mental causation isn’t real, practically everything we believe is false — “the end of the world”.' },
    { tag: 'Who argues what', q: 'Yablo', a: 'Mental properties are determinables of their neural realisers; determinables and determinates don’t compete; proportional causes are often mental.' }
  ];

  var mcCount = 0, essayCount = 0, sampleCount = 0;
  TOPICS.forEach(function (t) {
    mcCount += MCQ[t.key].length;
    essayCount += ESSAYS[t.key].length;
    ESSAYS[t.key].forEach(function (e) { if (e.sample) sampleCount++; });
  });

  var SUBJECT = {
    id: 'arts3367',
    code: 'ARTS3367',
    name: 'Philosophy of Mind and Psychology',
    tagline: 'In-class Test 1 (20%), weeks 1–4: ' + mcCount + ' multiple-choice questions and ' + essayCount +
      ' extended-response questions (' + sampleCount + ' from the sample handout), each with a dot-point model answer. Use the Format chips to practise just one section.',
    templates: TEMPLATES,
    build: build,
    labels: { guide: 'Topic primer', guideOpen: 'Hide primer', same: 'Another on this topic' },

    mockTest: {
      minutes: 45,
      blurb: 'Same shape as the real in-class test: <b>Section A</b>, ten multiple-choice questions across all four weeks (1 mark each); <b>Section B</b>, one mini-essay of up to 500 words, chosen from three (10 marks here). Feedback is hidden until you submit; the essay is then self-assessed against the dot-point model answer. Set the time limit to match your real test.',
      build: buildMock
    },

    drillBlurb: 'Key terms and who argues what, weeks 1–4.',
    drillSets: [
      { id: 'terms', label: 'Key terms', cards: TERMS },
      { id: 'who', label: 'Who argues what', cards: WHO }
    ],

    reference: {
      title: 'ARTS3367 reference',
      blurb: 'Key terms, gaps in the notes filled in, and how the essay is marked.',
      fromDrill: 'terms',
      sections: [
        { heading: 'Who argues what', rows: WHO.map(function (c) { return [c.q, c.a]; }) },
        { heading: 'Gaps in your notes, filled in', rows: [
          ['“Lightning is electrical discharge … slightly misleading” — why?',
           'Two reasons. Most electrical discharges (a spark from a jumper) aren’t lightning, so the identity is with a specific kind of discharge. And “is” can be read as predication (“lightning is a kind of discharge”) rather than identity. The careful form: for something to be lightning is for it to be an electrical discharge of kind K.'],
          ['“You can be competent with a term like pain without knowing …”',
           '…anything about neurophysiology. So “pain” doesn’t <i>mean</i> “C-fibre firing”: the identity is discovered, not definitional — just as people used “lightning” and “water” long before anyone knew about electricity or H₂O.'],
          ['Descartes, the cat and free will (the Q&A)',
           'Descartes thought a cat’s behaviour could in principle be explained mechanically (animals as complex automata). What he thought no mechanism could produce was human reason, flexible language use and free will. Those “gaps” are why he posited a non-mechanical mind. Free will and consciousness are still where mechanistic explanation seems to fall short.'],
          ['Week 2 (missed)',
           'Putnam: the functional-state hypothesis and multiple realisability — the Functionalism topic. Searle: strong vs weak AI, the Chinese Room, syntax vs semantics, and the replies — the Chinese Room topic.']
        ] },
        { heading: 'Core commitments of non-reductive physicalism (Week 4)', rows: [
          ['All concrete particulars are physical', '<b>Yes</b> — token physicalism'],
          ['Mental properties are real and irreducible', '<b>Yes</b>'],
          ['All mental properties are realised by physical mechanisms', '<b>Yes</b>'],
          ['Every mental property is identical to a physical property', '<b>No</b> — that is reductive (type) identity'],
          ['Mental phenomena possess novel causal powers', '<b>No</b> — but Kim argues NRP is committed to it, and that it conflicts with causal closure']
        ] },
        { heading: 'Writing the 500-word answer', rows: [
          ['Format', 'Coherent prose, not bullet points — the handout is explicit. The dot points here are for learning and planning only.'],
          ['Choose well', 'You pick 1 of 3. Choose the one where you can both explain the view and evaluate it.'],
          ['Use the sub-questions', 'Sample questions have two or three parts (“Explain… How might… Does this mean…”). Make each one a paragraph so none is missed.'],
          ['Shape', 'Thesis (≈50 words) · explain the view or argument (≈150) · objection or complication (≈150) · response and verdict (≈150).'],
          ['Concrete cases', 'Lightning and water, Clark Kent, the octopus, Jack’s stubbed toe, Sally’s marble, Sophie, the brick — examples show understanding.'],
          ['Precise distinctions', 'Identity vs correlation · type vs token · supervenes on · sufficient cause · determinable vs determinate · syntax vs semantics.'],
          ['The model answer', 'The handout’s model answer (≈450 words) explains the view, gives supporting evidence, separates correlation from identity, and ends with refuting cases. Follow that pattern.']
        ] }
      ]
    }
  };

  if (global.Subjects) global.Subjects.register(SUBJECT);
  global.ARTS3367_SUBJECT = SUBJECT;
})(typeof window !== 'undefined' ? window : globalThis);
