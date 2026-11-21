/* subjects/arts3367-t2.js — ARTS3367 Philosophy of Mind and Psychology.
   In-class Test 2: same format as Test 1 — 10 multiple-choice questions, then
   one mini-essay of up to 500 words chosen from three. New content:
     Consciousness   Nagel, "What Is It Like to Be a Bat?"; Jackson,
                     "Epiphenomenal Qualia" (the knowledge argument); Levine's
                     explanatory gap and the three responses; Strawson,
                     realistic monism and panpsychism; Godfrey-Smith on life,
                     nervous systems and machines
     Personal identity  identity, Leibniz's two principles, synchronic vs
                     diachronic; Locke's memory theory, circularity and
                     quasi-memory; Olson's animalism; Dennett's centre of
                     narrative gravity and Ismael's reply; Parfit on fission
                     and what matters
   The six essay questions from the sample-question handout are included word
   for word and flagged as such; the rest are written to the same pattern. */
(function (global) {
  'use strict';

  /* ============================ topic primers ============================ */

  var GUIDES = {
    nagel: {
      idea: 'Consciousness, lecture 1. Consciousness is the most familiar thing there is and the hardest to characterise. The sense that matters is not being awake (vs knocked out) or repressed desires: it is the <b>subjective quality</b> of mental life. Nagel: an organism has conscious states if and only if there is <b>something it is like to be</b> that organism — something it is like <i>for</i> it. “Without consciousness the mind–body problem would be much less interesting. With consciousness it seems hopeless.” Nagel’s bat shows why: the facts about what experience is like seem to be tied to a <b>point of view</b>, and the usual route to a physical reduction works by leaving points of view behind.',
      stepsTitle: 'Key claims',
      steps: [
        '<b>Qualia</b>: the subjective qualities of particular experiences (the hurtfulness of pain, the redness of seeing red). Talking about qualia does not presuppose that they are non-physical — they might be supervenient properties of neural assemblies firing in concert.',
        '<b>Why bats?</b> They are mammals, so they very probably have experience; but they perceive by echolocation, a sense unlike any of ours. Imagining webbed arms and hanging upside down only tells me what it would be like for <i>me</i> to behave like a bat.',
        'Suppose we had perfect knowledge of bat physiology. Nagel argues there would still be facts about bat experience that we cannot know or even conceive: our concepts are limited by the limits of our (possible) experience. Maths and perhaps physics transcend such limits; experience can only be understood in experiential terms.',
        'We can understand <i>other humans’</i> experience because we are physiologically similar. A bat’s pain we can perhaps grasp (we are both mammals); its echolocation we cannot.',
        '<b>Subjective vs objective</b>: a concept or description is subjective to the extent that it is graspable only from a particular point of view — by creatures with a certain physiology, mentality, perhaps culture.',
        '<b>Reductive explanation</b> moves from how a phenomenon appears to us towards a more objective description (heat → molecular motion; lightning → electrical discharge). This works only because both descriptions are of the same phenomenon and the appearances can be set aside. With experience, the appearance <i>is</i> the phenomenon: “what’s left of what it is like to be X if you take away X’s point of view?”',
        '“What X is like is Y” is unlike “water is H₂O”. So an objective explanation of what it is like to be a bat makes no sense.',
        '<b>Conclusion</b>: not that physicalism is false. “It would be truer to say that physicalism is a position we cannot understand because we do not at present have any conception of how it might be true.” Its status is like that of “matter is energy” if uttered by a pre-Socratic philosopher.'
      ],
      workedTitle: 'The argument, step by step',
      worked:
        '<div class="wq">Nagel’s argument</div>' +
        '<div class="step"><b>P1</b> There is something it is like to be a bat; facts about what it is like are facts about its experience.</div>' +
        '<div class="step"><b>P2</b> Those facts are subjective: graspable only from the bat’s type of point of view.</div>' +
        '<div class="step"><b>P3</b> Physical (and functional) descriptions are objective: graspable from any point of view, by abstracting away from how things appear to particular observers.</div>' +
        '<div class="step"><b>P4</b> Reduction succeeds by moving from the subjective appearance to the objective description of the same thing; for experience, moving away from the point of view moves away from the phenomenon.</div>' +
        '<div class="step"><b>C</b> So we cannot at present understand how experience could be physical. Physicalism may be true, but we lack the concepts to understand its truth.</div>',
      trapsTitle: 'Common confusions',
      traps: [
        'Nagel does <i>not</i> conclude that physicalism is false — that is Jackson. Nagel says we cannot <i>understand</i> how it could be true.',
        'The point is not that bats are mysterious because they are alien. Even human experience has a subjective character; bats just make it vivid.',
        '“Something it is like” does not mean “resembles something”. It means there is a subjective character for the creature itself.',
        'Unconsciousness from a blow to the head, and repressed (unconscious) desires, are different senses of “conscious” — not the target here.',
        'Nagel thinks we can grasp bat pain better than bat echolocation: the barrier is the gap between types of point of view, which comes in degrees.'
      ]
    },

    jackson: {
      idea: 'Consciousness, lecture 1. Jackson calls himself a “qualia freak”: there are features of experience that no amount of <b>physical information</b> includes. Physicalism, for Jackson, is the thesis that all information about the world is physical information — the kind supplied by physics, chemistry, neurophysiology, plus facts about causal and functional roles. The <b>knowledge argument</b> (Fred; Mary) is meant to show that thesis is false. Jackson then bites a bullet: qualia are <b>epiphenomenal</b> — caused by brain processes but causing nothing physical.',
      stepsTitle: 'Key claims',
      steps: [
        '<b>Fred</b> sees two colours where we see one shade of red. Neuroscientists produce a complete account of his brain and how it differs from ours. That account still leaves out what it is like for Fred to see the extra colour.',
        '<b>Mary</b> has spent her whole life in a black-and-white room and has learned <i>all</i> the physical information there is about human colour vision. When she is released and sees red, she learns something new about human colour vision.',
        'So physical information is not all the information there is. <b>Physicalism is false.</b> (The same structure works for music: study everything about it, then hear it for the first time.)',
        'The argument assumes that <b>all knowledge is knowledge of facts</b>. If Mary gains knowledge without learning a new fact — a new ability, or a new way of grasping a fact she already knew — the argument falls apart.',
        '<b>Epiphenomenalism</b>: qualia are caused by physical processes but have no physical effects. Jackson answers three objections. (1) “Obviously pain makes me wince” — regular succession isn’t causation; a brain process could cause both the pain and the wince. (2) Evolution — qualia can be <b>by-products</b> of brain processes that were selected, as the polar bear’s heavy coat is selected for warmth, not heaviness. (3) Other minds — behaviour can still be evidence of qualia through their <b>common cause</b>, as a report in one newspaper is evidence of a report in another.',
        'Jackson contrasts his argument with Nagel’s: the knowledge argument is about what a complete physical story leaves out, not about our inability to imagine an alien point of view. Fred and Mary are humans, not bats.',
        'Jackson later abandoned the argument and became a physicalist — but the 1982 paper is the one examined here.'
      ],
      workedTitle: 'The argument, step by step',
      worked:
        '<div class="wq">The knowledge argument (Mary)</div>' +
        '<div class="step"><b>P1</b> Before release, Mary knows all the physical information about human colour vision.</div>' +
        '<div class="step"><b>P2</b> On release, Mary learns something new about human colour vision — what it is like to see red.</div>' +
        '<div class="step"><b>P3</b> (Assumed) Learning something new is coming to know a new fact.</div>' +
        '<div class="step"><b>C1</b> So there are facts about human colour vision that are not physical facts.</div>' +
        '<div class="step"><b>C2</b> So physicalism (all information is physical information) is false.</div>' +
        '<div class="wq" style="margin-top:14px">Where physicalists push back</div>' +
        '<div class="step"><b>Deny P3</b> Mary gains an ability (to recognise, imagine, remember red), or a new perspective on — a new way of grasping — a fact she already knew.</div>' +
        '<div class="step"><b>Deny P1 or P2</b> Rarer: if she really knew everything physical, perhaps she could work out what red is like (Dennett).</div>',
      trapsTitle: 'Common confusions',
      traps: [
        'Jackson concludes physicalism is <i>false</i>; Nagel concludes only that we cannot understand how it could be true.',
        'Epiphenomenal qualia are <i>caused</i> by brain states. What they lack is effects on the physical world.',
        'The polar bear point: being heavy is a by-product of a coat selected for warmth. Qualia are the heaviness, not the warmth.',
        'The knowledge argument is not about bats or imagination. Its subjects are humans and its target is the completeness of physical information.',
        'A physicalist reply need not deny that Mary learns <i>something</i>. It denies that what she learns is a new, non-physical <i>fact</i>.'
      ]
    },

    gap: {
      idea: 'Consciousness, lecture 2. Joseph Levine names the <b>explanatory gap</b>: you can learn everything there is to know about colour science and still gain understanding on first seeing a colour. “Heat is molecular motion” explains heat — once you know what plays heat’s causal role, nothing is left over. “Pain is C-fibre firing” leaves something over: why does <i>that</i> feel like <i>this</i>? So psychophysical identities would be unlike other scientific identities. Nagel, Jackson and Levine give claims about <b>epistemic</b> limits; the question is what <b>metaphysical</b> conclusion, if any, follows.',
      stepsTitle: 'Key claims',
      steps: [
        '<b>Three responses</b> to the epistemic problem of consciousness:',
        '<b>1. Dualism</b> (not Cartesian — about properties, not a thinking substance): there is an epistemic gap because there is an <b>ontological gap</b>. Jackson (1982), Chalmers.',
        '<b>2a. Eliminativism / illusionism</b> (a form of materialism): consciousness is not what it seems. Dennett, the Churchlands, Frankish. Not covered further in this course. Strawson calls the denial of consciousness “the strangest thing that has ever happened in the whole history of human thought”.',
        '<b>2b. Bridge-building materialism</b>: there is no ontological gap between consciousness and the rest of nature. Reality is fundamentally uniform but can appear to us in different guises. Mary learns no new <i>fact</i> when she first sees red; she acquires a new <i>perspective</i> on something she already knew.',
        'Compare Superman / Clark Kent: Lois can learn “Clark Kent is Superman” without learning about a new person — she gains a new way of thinking of the same man. Bridge-builders treat phenomenal concepts the same way.',
        'A related physicalist reply (from outside the notes): the <b>ability hypothesis</b> (Lewis, Nemirow) — Mary gains know-how (to recognise, imagine and remember red), not knowledge of a new fact.',
        '<b>Physicalism is not obvious</b>: any particular pain is located in space and time, but the property of being in pain doesn’t seem to be.'
      ],
      workedTitle: 'Epistemic gap vs metaphysical gap',
      worked:
        '<div class="wq">The inference each side argues about</div>' +
        '<div class="step"><b>E</b> (epistemic) Complete physical knowledge does not let us know, or understand, what experience is like.</div>' +
        '<div class="step"><b>M</b> (metaphysical) Experience is something over and above the physical.</div>' +
        '<div class="step"><b>Dualist</b> E is best explained by M: the gap in knowledge reflects a gap in reality.</div>' +
        '<div class="step"><b>Bridge-builder</b> E is explained by our having two kinds of concept (physical and phenomenal) for one reality; M doesn’t follow — compare learning that Clark Kent is Superman.</div>' +
        '<div class="step"><b>Eliminativist / illusionist</b> E is overstated: experience is not what it seems, so the thing that seems unexplained is not really there in that form.</div>' +
        '<div class="step"><b>Nagel</b> E shows we can’t yet understand how physicalism could be true — not that it is false.</div>',
      trapsTitle: 'Common confusions',
      traps: [
        'Levine’s gap is <i>explanatory</i> (epistemic). He doesn’t conclude that materialism is false.',
        'The dualism here is property dualism, not Descartes’ substance dualism.',
        'Eliminativism and bridge-building are both materialist; they differ on whether consciousness is real as it seems.',
        'Bridge-building materialism accepts that Mary gains something new — a perspective, not a fact.',
        '“Heat is molecular motion” closes the explanatory gap because heat is defined by its causal role. The worry is that “what it’s like” is not a causal role.'
      ]
    },

    strawson: {
      idea: 'Consciousness, lecture 2. Galen Strawson defends <b>realistic physicalism</b>: experience is real (denying it is the strangest thing in the history of thought), and everything concrete is physical. So experience is physical. The usual contrast between “the mental” and “the physical” is a mistake made by physicalism’s opponents <i>and</i> its proponents. Physics, he argues, doesn’t tell us the intrinsic nature of matter; and experience can’t emerge from the wholly non-experiential. Conclusion: the experiential is fundamental — <b>panpsychism</b>.',
      stepsTitle: 'Key claims',
      steps: [
        '<b>Defining “physical”</b>: by pointing at examples of physical things, not by current physics — we cannot presume physics captures everything about the physical. Physicalism is the claim that every real concrete phenomenon is physical in this sense (in the notes: close to token identity).',
        '<b>Physics doesn’t capture experiential being</b>, so it doesn’t capture everything there is to say about the physical.',
        '<b>Argument from authority</b>: Russell — physics is mathematical not because we know so much about the physical world but because we know so little; Eddington — physics gives structure, not intrinsic nature.',
        '<b>Physics is functionalist in character</b>: it describes how physical things relate to and affect each other (including our sense organs and instruments). It says nothing about the intrinsic nature of matter itself — it abstracts from intrinsic features.',
        '<b>The layer-cake image</b>: if the physical is fundamentally non-experiential, the experiential must sit at a non-fundamental level, emerging from what is below.',
        '<b>Emergence</b>: liquidity is <b>weak</b> emergence — intelligible in terms of how H₂O molecules behave. Experience from the wholly non-experiential would have to be <b>strong</b> (brute) emergence, which Strawson rejects as incoherent. (The notes also record him suggesting that extension might be emergent — a claim it is hard to know how to assess.)',
        '<b>So</b> the experiential is fundamental: qualities like experientiality are fundamental features, like mass and charge, and could be present everywhere. That is <b>panpsychism</b>. Some traditions hold that spiritual forces animate nature; perhaps for every physical system there is something it is like “from the inside”.',
        '<b>The lecturer’s verdict</b>: physicalist or not, the answer is weird — strong emergence or panpsychism. The lecturer is not convinced that rejecting strong emergence is the way to go. “The world doesn’t care about our sense of weirdness.”'
      ],
      workedTitle: 'The argument, step by step',
      worked:
        '<div class="wq">Why physicalism entails panpsychism</div>' +
        '<div class="step"><b>P1</b> Experience is real (realism).</div>' +
        '<div class="step"><b>P2</b> Every real concrete phenomenon is physical (physicalism).</div>' +
        '<div class="step"><b>C1</b> So experience is physical.</div>' +
        '<div class="step"><b>P3</b> Physics describes only structure and relations, not the intrinsic nature of matter, so it does not rule out that matter is intrinsically experiential.</div>' +
        '<div class="step"><b>P4</b> If the fundamental physical were wholly non-experiential, experience would have to emerge from it.</div>' +
        '<div class="step"><b>P5</b> Emergence must be intelligible (like liquidity from H₂O); experience from the wholly non-experiential would be brute, strong emergence, which is incoherent.</div>' +
        '<div class="step"><b>C2</b> So the fundamental physical is not wholly non-experiential: experientiality is a fundamental feature of matter — panpsychism (micropsychism).</div>',
      trapsTitle: 'Common confusions',
      traps: [
        'Strawson is a physicalist. He thinks physicalism, properly understood, <i>entails</i> panpsychism.',
        '“Physical” is not “whatever current physics says exists”. He defines it by examples, so experience can count as physical.',
        'Liquidity is his example of acceptable (weak) emergence, not of the problematic kind.',
        'Strawson rejects eliminativism as the strangest belief in history — he is not an illusionist.',
        'The claim is that physics leaves out intrinsic nature, not that physics is false.'
      ]
    },

    godfrey: {
      idea: 'Consciousness, lecture 2. Peter Godfrey-Smith takes the other horn: <b>emergence after all</b>. In our experience, living things are the only minded things, so perhaps mind arises out of living matter — specifically the activity of nervous systems. This is neither <b>carbon chauvinism</b> (the materials themselves matter) nor <b>vitalism</b> (a special life force). He has a <b>functionalist view of life</b>, but argues that what matters is the <b>principles of operation</b> — and digital computers don’t run on the same principles as brains.',
      stepsTitle: 'Key claims',
      steps: [
        '<b>Life as a cluster concept</b>: living things metabolise, reproduce, maintain themselves, and so on. No single feature is necessary — a functionalist view of life, not a special substance or force.',
        '<b>Carbon chauvinism</b> (not his view): perhaps the material matters (carbon vs silicon). <b>Vitalism</b> (not his view): living things have a special force or energy.',
        '<b>The AI challenge</b>: if machines can have minds, life is not the key to understanding mind and consciousness.',
        'Brains are very different from digital computers: neurons vs a CPU, how information is stored, and so on.',
        '<b>Chalmers’ neuron-replacement argument</b>: replace your neurons one at a time with electronic parts that do exactly the same job. Your behaviour can’t change. Chalmers argues your experience can’t change either — it would be absurd for it to fade without you noticing — so the right functional organisation is enough for experience, in any material. (Your notes say “would not be the same”; Chalmers’ own conclusion is that it would stay the same.)',
        '<b>Godfrey-Smith rejects the premise</b>: electronic neurons won’t be functionally equivalent to biological ones. Not because we don’t understand biological neurons well enough, but because electronics doesn’t operate on the principles needed to replicate them.',
        '<b>Not artificiality but principles of operation</b>: an artificial system that worked the way living nervous systems work could in principle be a candidate for experience. A digital computer, whatever program it runs, is not one.'
      ],
      workedTitle: 'Chalmers vs Godfrey-Smith',
      worked:
        '<div class="wq">The replacement argument</div>' +
        '<div class="step"><b>P1</b> Each neuron can be replaced by an electronic part that is functionally equivalent to it.</div>' +
        '<div class="step"><b>P2</b> After every step, behaviour (including saying “I see red”) is unchanged.</div>' +
        '<div class="step"><b>P3</b> It is absurd that experience fades or switches while the subject sincerely reports no change.</div>' +
        '<div class="step"><b>C</b> So the fully electronic system has the same experience: functional organisation suffices, whatever the material.</div>' +
        '<div class="wq" style="margin-top:14px">Godfrey-Smith’s reply</div>' +
        '<div class="step"><b>Deny P1</b> Electronic parts operate on different principles, so they cannot be functionally equivalent to living neurons in the respects that matter. The argument never gets started.</div>' +
        '<div class="step"><b>Upshot</b> He is still a functionalist of a kind (about life, and about what mind depends on) — but the functions that matter are fine-grained ways of operating that digital hardware does not share.</div>',
      trapsTitle: 'Common confusions',
      traps: [
        'Godfrey-Smith is not a carbon chauvinist: the material as such doesn’t matter, the principles of operation do.',
        'He is not a vitalist: no special life force — life is a cluster of functional features.',
        'He doesn’t say we understand neurons too poorly to copy them. He says electronics works on different principles.',
        'Chalmers’ replacement argument concludes that experience is <i>preserved</i>; Godfrey-Smith attacks its premise, not its logic.',
        'His view is emergentist — the opposite horn to Strawson’s panpsychism.'
      ]
    },

    locke: {
      idea: 'Personal identity, lecture 1. <b>Identity</b> is the relation everything has to itself and to no other thing — the sense in which Superman is Clark Kent, not the sense in which identical twins are “identical”. The <b>synchronic</b> question (at a time) is what am I? — answered with a <b>sortal</b> concept. The <b>diachronic</b> question (across time) is what makes someone at t1 the same as someone at t2? Locke’s answer for <b>persons</b> is consciousness extended by <b>memory</b>, still the most popular theory of personal identity.',
      stepsTitle: 'Key claims',
      steps: [
        '<b>Identity of indiscernibles</b>: there cannot be two things that are exactly alike (if x and y are exactly alike, x = y). Leibniz held it as a metaphysical necessity, with an appeal to God. <b>Indiscernibility of identicals</b> (Leibniz’s law): if x is numerically identical to y, they are exactly alike. The two are often conflated.',
        '<b>Sortals</b> divide things into sorts (person, animal, philosopher). <b>Diachronic</b> identity appears to violate Leibniz’s law — the same thing has different properties at different times — so it involves understanding change: what changes can you survive?',
        '<b>Locke’s three substances</b>: God (without beginning, eternal, everywhere); finite intelligences (souls); bodies. Finite spirits and particles are individuated by the time and place they began to exist — which doesn’t solve personal identity.',
        '<b>Masses of matter</b>: a complex body’s identity is the identity of its particles — it cannot gain or lose a single atom. So the Ship of Theseus doesn’t survive.',
        '<b>Living things</b>: identity persists as long as the same life processes go on, through changes of matter.',
        '<b>Persons</b>: a thinking thing that can think of itself as itself. Consciousness is extended by memory: A at t1 is the same person as B at t2 if and only if B remembers being A. Personal identity is not determined by the body, and the theory is neutral on the mind–body problem — wake up with someone’s memories and you are them.',
        '<b>Problems and fixes</b>: we forget (my early childhood) → broaden memory to <b>psychological continuity</b> (overlapping chains). Memory is reconstructed from traces that fade or are overwritten. <b>Circularity</b>: what makes a memory genuine rather than confabulated? Being of something <i>I</i> did — which presupposes identity. Fix: <b>q-memory</b>, a state just like a memory except we don’t require it to be of one’s own past, plus a chain of q-memories preserved by a <b>reliable mechanism</b> (reliable at the level of the brain, not infallible).',
        '<b>Duplication</b>: if one brain is scanned into two people, both q-remember being you. On what basis is one rather than the other you?'
      ],
      workedTitle: 'The circularity objection and the fix',
      worked:
        '<div class="wq">The objection</div>' +
        '<div class="step"><b>1</b> Memory theory: B is the same person as A iff B remembers A’s experiences.</div>' +
        '<div class="step"><b>2</b> But genuine memory differs from seeming memory (confabulation): I can only genuinely remember experiences that were <i>mine</i>.</div>' +
        '<div class="step"><b>3</b> So “B remembers A’s experience” already includes “B is A”. Identity is used to define memory, which is used to define identity — circular.</div>' +
        '<div class="wq" style="margin-top:14px">The fix</div>' +
        '<div class="step"><b>q-memory</b> A state just like a memory, where we don’t care whether the experience was the rememberer’s own (or whether it is accurate).</div>' +
        '<div class="step"><b>Reliable cause</b> Require that the q-memory be caused by the past experience through a reliable mechanism — the brain’s ordinary way of preserving traces.</div>' +
        '<div class="step"><b>New theory</b> B is the same person as A iff B is linked to A by a chain of reliably caused q-memories. No step mentions identity, so no circle.</div>',
      trapsTitle: 'Common confusions',
      traps: [
        'Numerical identity (one thing) is not qualitative identity (exact similarity, as with twins).',
        'Identity of indiscernibles (exactly alike → identical) is the converse of Leibniz’s law (identical → exactly alike).',
        'Locke’s strict view of masses of matter (no atom can be lost) is for lumps of matter, not for living things or persons.',
        'The memory theory is neutral about the mind–body problem — a person could in principle move between bodies or substances.',
        'q-memory doesn’t make memory infallible; the mechanism need only be reliable.'
      ]
    },

    olson: {
      idea: 'Personal identity, lecture 2. Eric Olson’s <b>animalism</b>: you are a human animal — a homo sapiens, a biological organism. Not just related to one: you <i>are</i> one. Your persistence conditions are biological, not psychological. So the memory theory is wrong: you go where the organism goes, and a teletransporter that annihilates the organism is a way to die, not a way to travel.',
      stepsTitle: 'Key claims',
      steps: [
        'Animalism is a <b>non-psychological</b> account of identity. Memory swaps don’t move you: animalism doesn’t support memory-continuity theory.',
        'The <b>teletransporter</b> annihilates the organism, so you die and a duplicate is made. The memory theory can’t say what happens if <i>two</i> people are created on the other side.',
        '<b>The thinking animal argument</b>: (1) there is a human animal sitting in your chair; (2) the human animal in your chair is thinking; (3) you are the thinking thing sitting in your chair; (4) so you are the human animal.',
        'Denying (1) has implications that are too big (there would be no human animals). Substance dualists may deny (2): only an immaterial soul thinks.',
        'The <b>constitution</b> reply: a lump of bronze and the statue it makes up are coincident but distinct objects; maybe you and the animal are too. Olson denies that this applies to you and the human animal — then there would be two thinkers in your chair.',
        '<b>“Person” is a phase sortal</b>, like “child” or “teenager”: intelligence and reflection are capacities some animals have for some of their lives. Being a person is something an animal can be for a while, not what you fundamentally are.'
      ],
      workedTitle: 'The thinking animal argument',
      worked:
        '<div class="wq">Premises and who denies which</div>' +
        '<div class="step"><b>P1</b> There is a human animal sitting in your chair. <i>Denying it: the costs are too big.</i></div>' +
        '<div class="step"><b>P2</b> The human animal sitting in your chair is thinking. <i>Denied by substance dualists (only the soul thinks).</i></div>' +
        '<div class="step"><b>P3</b> You are the thinking thing sitting in your chair. <i>Denied by constitution theorists (two coincident thinkers?)</i></div>' +
        '<div class="step"><b>C</b> So you are the human animal.</div>' +
        '<div class="wq" style="margin-top:14px">Why P3 is hard to deny</div>' +
        '<div class="step">If the animal thinks and you are something else that thinks, there are two thinkers in your chair — and you could not tell whether you are the person or the animal.</div>',
      trapsTitle: 'Common confusions',
      traps: [
        'Animalism is not the claim that you have or are related to an animal body. It is that you <i>are</i> the animal.',
        'Animalism is not a memory theory. Psychological continuity is neither necessary nor sufficient for you to persist.',
        'A phase sortal (child, teenager, person) is something a thing can stop being without ceasing to exist.',
        'The statue and the lump are the constitution theorist’s example. Olson denies that you relate to the animal like that.',
        'Substance dualists deny P2 (the animal thinks), not P1.'
      ]
    },

    dennett: {
      idea: 'Personal identity, lecture 2. Dennett is a materialist sceptical of the idea of a <b>self</b>. If there were a self, it would have to be part or the whole of an animal — but walk around inside a brain and you won’t find one. Living systems do maintain their boundaries, which gives a <b>minimal self</b>. The characteristically human self is a <b>centre of narrative gravity</b>: like a centre of gravity, an abstraction — a useful fiction — spun from self-protective strings of narrative. Jenann <b>Ismael</b> replies that Dennett throws the baby out with the bathwater: our self-representation does real work.',
      stepsTitle: 'Key claims',
      steps: [
        '<b>Minimal self</b>: something abstract — just the existence of an organisation that tends to distinguish, control and preserve portions of the world. Living systems maintain their boundaries, so they are inherently self-like. It could apply to machines, even countries.',
        '<b>Narrative self</b>: the characteristic feature of human selfhood is self-protective strings of narrative (words). Not a conscious storytelling process — the narratives are produced, rather than authored by a self that already exists.',
        '<b>Centre of gravity</b> analogy: a centre of gravity is not a physical part of an object, but it is a useful, objective abstraction. The self is likewise a theorist’s fiction.',
        '<b>Consequences</b>: the narrative self depends on language, so non-linguistic creatures lack it; it is a contingent capacity of the human brain, so one brain can spin more than one (dissociative identity disorder); it is a fiction we have little conscious control over; and (Dennett doesn’t use the word) it becomes <b>epiphenomenal</b>.',
        '<b>Ismael</b>: self-representation is not epiphenomenal. A self-steering system needs to represent itself; our self-representation guides us through the world.',
        'Ismael adds a <b>social</b> dimension: we construct a self to represent ourselves in our relations with each other.',
        'Consequences of Ismael’s view: diachronic identity questions lose their force; she also doesn’t discuss fission-type cases.'
      ],
      workedTitle: 'Dennett vs Ismael',
      worked:
        '<div class="wq">Dennett</div>' +
        '<div class="step"><b>1</b> Organisms maintain boundaries: a minimal, biological self.</div>' +
        '<div class="step"><b>2</b> Humans, with language, spin narratives about themselves, as spiders spin webs — not by conscious design.</div>' +
        '<div class="step"><b>3</b> The self is the centre of narrative gravity of those stories: an abstraction, a fiction, which (on this view) does no causal work.</div>' +
        '<div class="wq" style="margin-top:14px">Ismael</div>' +
        '<div class="step"><b>1</b> A self-steering system needs a model of itself to steer by.</div>' +
        '<div class="step"><b>2</b> Our self-representation is that model: it guides action and coordinates us with others.</div>' +
        '<div class="step"><b>3</b> So the self-representation is not epiphenomenal — calling it a mere fiction throws out the baby with the bathwater.</div>',
      trapsTitle: 'Common confusions',
      traps: [
        'Dennett is a materialist, not a dualist: his scepticism is about a self, not about minds or brains.',
        'The narrative is not consciously composed. The stories largely spin us, not the other way round.',
        'A centre of gravity is a fiction in the sense of an abstraction — not an error or a lie.',
        'The minimal self is biological and needs no language; the narrative self needs language.',
        'Ismael doesn’t deny the self is constructed. She denies that a construction which guides action is epiphenomenal.'
      ]
    },

    parfit: {
      idea: 'Personal identity, lecture 2. Derek Parfit holds a Lockean view of what identity consists in, but argues that <b>identity matters less than we think</b>. We care about identity because it seems to ground important attitudes — regret, anticipation of pain, praise and blame. But that reliance is a contingent convenience, a conceptual shortcut, not a deep metaphysical truth: identity, in us, merely correlates with the relations that really do matter. <b>Fission</b> cases show the two can come apart.',
      stepsTitle: 'Key claims',
      steps: [
        '<b>Fission</b>: an event that causes two copies of someone’s memories (psychology) to be instantiated elsewhere. Both are psychologically continuous with the original, but they can’t both be identical to the original (they are not identical to each other).',
        '<b>Psychological connectedness</b>: direct links, such as episodic memory and intentional control (intending now, acting later).',
        '<b>Psychological continuity</b>: overlapping chains of psychological connectedness.',
        '<b>Identity</b> = <b>non-branching</b> psychological continuity. In fission, continuity branches, so neither survivor is the original — yet nothing that matters has been lost.',
        'Connectedness comes in degrees and can weaken within a single life over time. Identity is all-or-nothing; what matters is a matter of degree.',
        '<b>Parfit’s motivation is ethical</b>: if the self is a construction, we are at least partly responsible for it. If our relation to our past and future selves is indirect and a matter of degree, self-interest and egoism should have less hold on us.'
      ],
      workedTitle: 'Fission, step by step',
      worked:
        '<div class="wq">Why identity isn’t what matters</div>' +
        '<div class="step"><b>1</b> If one of my brain-halves were transplanted and the other destroyed, the survivor would be me (one-one continuity).</div>' +
        '<div class="step"><b>2</b> In fission, both halves survive in two bodies. Each relates to me just as the lone survivor would.</div>' +
        '<div class="step"><b>3</b> Identity is one-one: both can’t be me (they aren’t each other), and picking one is arbitrary. So, given the non-branching clause, neither is me.</div>' +
        '<div class="step"><b>4</b> But how can a double success be as bad as death? What I care about — continuity and connectedness — is fully present twice over.</div>' +
        '<div class="step"><b>C</b> So identity is not what matters; psychological connectedness and continuity are.</div>',
      trapsTitle: 'Common confusions',
      traps: [
        'Parfit doesn’t reject the Lockean account of identity. He accepts it and says identity isn’t what matters.',
        'Connectedness = direct links; continuity = overlapping chains of them. Don’t swap them.',
        'The non-branching clause is what makes fission end identity — not any loss of memory.',
        'Parfit’s point is ethical as well as metaphysical: less egoism, more responsibility for the self we construct.',
        'Degrees of connectedness don’t make identity a matter of degree. Identity stays all-or-nothing.'
      ]
    }
  };

  var TOPICS = [
    { key: 'nagel',    name: 'Nagel: what it’s like' },
    { key: 'jackson',  name: 'Jackson: knowledge argument' },
    { key: 'gap',      name: 'Explanatory gap & responses' },
    { key: 'strawson', name: 'Strawson: panpsychism' },
    { key: 'godfrey',  name: 'Godfrey-Smith: life & machines' },
    { key: 'locke',    name: 'Locke & memory theory' },
    { key: 'olson',    name: 'Olson: animalism' },
    { key: 'dennett',  name: 'Dennett & Ismael: the self' },
    { key: 'parfit',   name: 'Parfit: what matters' }
  ];

  /* =========================== multiple choice ============================
     o[0] is always the correct answer; options are shuffled when built.
     `why` explains the answer and names the trap in the best distractor. */

  var MCQ = {
    nagel: [
      { q: 'Which sense of “consciousness” is the target of the lectures on Nagel and Jackson?',
        o: ['The subjective quality of mental life — what an experience is like for its subject',
            'Being awake and responsive, as opposed to knocked out by a blow to the head',
            'Thoughts and desires we have access to, as opposed to repressed (unconscious) ones',
            'The capacity to report one’s own states in language and reason about them aloud'],
        why: 'The lectures set aside unconsciousness from a bump on the head and repressed desires as “not relevant”. The target is <b>phenomenal</b> consciousness: the subjective quality of experience. Reportability is a functional capacity, not the subjective quality itself.' },
      { q: 'According to Nagel, when does an organism have conscious mental states?',
        o: ['If and only if there is something it is like to be that organism, for the organism',
            'If and only if its behaviour cannot be fully explained by any physical mechanism',
            'If and only if it has a nervous system complex enough to process sensory input',
            'If and only if it can describe its own inner states to others who share its language'],
        why: 'Nagel’s criterion: an organism has conscious states iff there is <b>something it is like to be</b> it — something it is like <i>for</i> it. He doesn’t make it depend on language, on any specific nervous system, or on the failure of physical explanation.' },
      { q: 'What are qualia?',
        o: ['The subjective qualities of particular experiences, such as the hurtfulness of pain',
            'The physical properties of objects, such as wavelength, that cause our experiences',
            'The behavioural dispositions, such as wincing, by which we recognise pain in others',
            'Non-physical substances that carry experiences, as souls carry thoughts for Descartes'],
        why: 'Qualia are the subjective qualities of experiences. The lectures stress that using the word does <i>not</i> presuppose that qualia are non-physical — so “non-physical substances” smuggles in a conclusion.' },
      { q: 'Why does Nagel choose bats as his example?',
        o: ['As mammals they surely have experience, but echolocation is unlike any sense of ours',
            'Bats are the simplest creatures that have experience, so they are the easiest case to study',
            'Bats lack a cortex, so their experience cannot be explained by neuroscience at all',
            'Bats are alien enough that we cannot be confident they have experiences at all'],
        why: 'Bats are close enough (mammals) that we are confident they experience, and far enough (echolocation) that we cannot imagine what it is like. If we doubted they had experience at all, the example would lose its point.' },
      { q: 'Nagel imagines having webbing on his arms, hanging upside down and catching insects. What does he say this tells him?',
        o: ['Only what it would be like for him to behave like a bat',
            'Roughly what it is like to be a bat, minus the experience of echolocation itself',
            'Nothing whatsoever, since he cannot really imagine any of these things in practice',
            'What a bat’s behaviour is caused by, though not how a bat’s nervous system works'],
        why: 'Imagination is limited by our own experience: it tells me what it would be like for <b>me</b> to behave like a bat. That is the wrong subject — the question is what it is like for a bat to be a bat.' },
      { q: 'In Nagel’s sense, when is a concept or description <b>subjective</b>?',
        o: ['To the extent that it is graspable only from a particular point of view',
            'When it expresses a personal opinion rather than a fact that could be true or false',
            'When it is about a mind rather than about a physical object or process',
            'When different observers are likely to disagree about whether it applies'],
        why: 'Subjective = graspable only from a particular point of view — by creatures with a certain physiology, mentality and perhaps culture. Nagel thinks there are subjective <i>facts</i>, so “mere opinion” is the wrong reading.' },
      { q: 'How does reductive explanation normally work, on Nagel’s account?',
        o: ['It moves from how a phenomenon appears to us to a more objective description of the same thing',
            'It shows that the phenomenon does not really exist and was only a misleading appearance',
            'It finds a correlation between two phenomena and treats one as the cause of the other',
            'It replaces the objective description of a phenomenon with how it is experienced'],
        why: 'Heat → molecular motion; lightning → discharge. We leave behind how the thing appears to us and describe the <b>same phenomenon</b> objectively. With experience, leaving the point of view behind leaves the phenomenon behind too.' },
      { q: 'Why, according to Nagel, does the usual route to reduction fail for experience?',
        o: ['Because abandoning the point of view abandons the very thing to be explained',
            'Because experiences are too complex for current neuroscience to describe',
            'Because experiences are not located anywhere in space, unlike brain processes',
            'Because no one has yet found a brain state that is correlated with an experience'],
        why: '“What’s left of what it is like to be X if you take away X’s point of view?” The appearance, for experience, <i>is</i> the reality. The problem is in principle, not a matter of complexity or missing data.' },
      { q: 'What does Nagel conclude about physicalism?',
        o: ['We cannot at present understand how it could be true, so it would be a mistake to call it false',
            'It is false, since there are facts about experience that are not physical facts',
            'It is true, since every experience is a physical event in the brain of some creature',
            'It is meaningless, since “physical” cannot be defined without already presupposing it'],
        why: 'Nagel: “physicalism is a position we cannot understand because we do not at present have any conception of how it might be true.” The claim that it is <i>false</i> is Jackson’s.' },
      { q: 'Nagel compares the status of physicalism today with “matter is energy” uttered by a pre-Socratic philosopher. What is the point of the comparison?',
        o: ['A claim can be true even when we lack the concepts to understand how it could be true',
            'Ancient philosophers already anticipated physicalism, so it is not a new idea at all',
            'Like early speculations about matter, physicalism will eventually be shown to be false',
            'Physicalism is a matter of faith, which is why it cannot be supported by argument'],
        why: 'The pre-Socratic could not have understood “matter is energy” — the framework (modern physics) didn’t exist — yet it is true. Likewise physicalism may be true though we can’t yet see how.' },
      { q: 'According to the lecture, why can we understand other humans’ experiences better than a bat’s?',
        o: ['We are physiologically similar, so their point of view is of a type we share',
            'Humans can describe their experiences to us in a language we understand',
            'Human experiences are simpler and more uniform than the experiences of bats',
            'Humans have the same brain states as us, but bats have different brain states'],
        why: 'The barrier is the gap between <b>types</b> of point of view. Similar physiology means a similar type. Language helps, but Nagel’s point is about physiology and the experience it gives you.' },
      { q: 'Nagel quote: “Without consciousness the mind–body problem would be much less interesting. With consciousness …” How does it end?',
        o: ['“… it seems hopeless.”',
            '“… it becomes a problem for science, not philosophy.”',
            '“… it is solved by the identity theory.”',
            '“… it shows that dualism must be true.”'],
        why: '“With consciousness it seems hopeless.” Consciousness is what makes the mind–body problem really intractable — it is why reductions that work elsewhere seem to fail here.' }
    ],

    jackson: [
      { q: 'What does Jackson mean by calling himself a “qualia freak”?',
        o: ['He holds that some features of experience are left out by all the physical information',
            'He holds that qualia are an illusion that should be eliminated from scientific psychology',
            'He has unusual colour experiences, like Fred, that most other people never have',
            'He holds that qualia are identical to brain states, though we cannot see how'],
        why: 'A qualia freak holds that there are features of bodily sensations and perceptual experiences that <b>no amount of purely physical information</b> includes. Identity (last option) is the physicalism he is attacking.' },
      { q: 'How does Jackson understand physicalism?',
        o: ['All information about the world is physical information',
            'Every mental state is correlated with some physical brain state',
            'Mental states are defined by their causal roles in a system',
            'There are no minds, only bodies and their behaviour'],
        why: 'For Jackson, physicalism is the thesis that <b>all information is physical information</b> — the sort physics, chemistry and neurophysiology supply, plus causal and functional facts. Correlation is something dualists accept too.' },
      { q: 'What is the Fred example meant to show?',
        o: ['A full physical account of Fred’s brain would leave out what his extra colour is like',
            'People with unusual colour vision cannot be studied by neuroscience at all',
            'Colour experiences are caused by the physical properties of the objects seen',
            'Fred’s extra colour experiences must be caused by something non-physical in his brain'],
        why: 'Fred sees two colours where we see one. Even with a full account of his brain and how it differs from ours, we wouldn’t know what it is like for Fred — so physical information leaves something out. Nothing is claimed about non-physical causes.' },
      { q: 'What does Mary know before she leaves the black-and-white room?',
        o: ['All the physical information there is about human colour vision',
            'What it is like to see red, from studying the brain states involved',
            'Most of the physics of colour, but not the neuroscience of seeing it',
            'Nothing about colour, since she has only ever seen black and white'],
        why: 'The argument stipulates that Mary knows <b>all</b> the physical information. If she merely lacked some neuroscience, her learning something new on release would show nothing about physicalism.' },
      { q: 'What is the conclusion of the knowledge argument?',
        o: ['Physical information is not all the information there is, so physicalism is false',
            'We cannot know what experiences are like without having had them ourselves',
            'Colour experiences are identical to brain states, but known in a different way',
            'Mary’s knowledge before release was mistaken, so neuroscience must be revised'],
        why: 'Mary learns something new although she knew all the physical information, so there is <b>more information than the physical</b>, and physicalism is false. “You must have had the experience” is a weaker, epistemic claim nobody denies.' },
      { q: 'Which hidden assumption of the knowledge argument do physicalists most often attack?',
        o: ['That all knowledge, including what Mary gains, is knowledge of facts',
            'That Mary was really in a black-and-white room with no colour in it at all',
            'That human colour vision involves the brain rather than only the eyes',
            'That it is possible in principle to know all the physical facts about vision'],
        why: 'If Mary gains knowledge <b>without learning a new fact</b> — an ability, or a new way of grasping a fact she knew — the argument falls apart. The room’s details are inessential; the argument would work with music too.' },
      { q: 'What is epiphenomenalism about qualia?',
        o: ['Qualia are caused by brain processes but have no effects on the physical world',
            'Qualia cause brain processes but are not themselves caused by anything physical',
            'Qualia are identical to brain processes and share all of their causal powers',
            'Qualia do not exist, and talk of them is an illusion created by the brain'],
        why: 'Epiphenomenal qualia are <b>effects without physical effects</b>: caused by brain processes, causally idle with respect to the physical. They are real (unlike on eliminativism) and not identical to brain processes.' },
      { q: 'How does Jackson answer the objection that qualia must have evolved because they help survival?',
        o: ['They may be by-products of selected brain processes, like a polar bear coat’s heaviness',
            'Evolution only selects for behaviour, so nothing mental could ever have been selected for',
            'Qualia did help survival, because they directly cause the behaviour that keeps animals alive',
            'Qualia appeared all at once, too recently in evolution for natural selection to act'],
        why: 'The polar bear’s coat was selected for <b>warmth</b>; its <b>heaviness</b> came along as a by-product. Qualia are like the heaviness: by-products of brain processes that do help survival. Saying they cause behaviour gives up epiphenomenalism.' },
      { q: 'If qualia have no physical effects, how can I know that other people have them, according to Jackson?',
        o: ['Their behaviour and their qualia have a common cause, so behaviour is evidence of qualia',
            'I can’t: epiphenomenalism leads to scepticism about other minds, which Jackson accepts',
            'Other people tell me about their qualia, and their words are caused by those qualia',
            'I directly perceive the qualia of others when I observe their facial expressions'],
        why: 'Jackson’s newspaper analogy: one paper’s report is evidence of another’s because both are caused by the same event. Brain processes cause both behaviour and qualia, so behaviour is evidence of qualia. Saying their words are caused by their qualia contradicts epiphenomenalism.' },
      { q: 'How does Jackson answer the objection that it is obvious the hurtfulness of pain makes us avoid it?',
        o: ['Regular succession isn’t causation: a brain process may cause both the pain and the avoidance',
            'Pain does cause avoidance, but only through a separate, non-physical chain of causes running alongside the brain',
            'Avoidance behaviour is learned through conditioning, so it doesn’t need any cause',
            'People often fail to avoid pain, so there is no reliable link to explain'],
        why: 'Regular succession isn’t causation: the brain process that causes the pain also causes the avoidance. The second option makes qualia causes after all, which is not epiphenomenalism.' },
      { q: 'How does Jackson distinguish the knowledge argument from Nagel’s bat argument?',
        o: ['His is about what a complete physical story leaves out, not our inability to imagine an alien viewpoint',
            'His concludes that we cannot understand physicalism, whereas Nagel concludes that it is false',
            'His relies on animals that are very unlike us, whereas Nagel’s concerns ordinary human beings',
            'His is about the causes of behaviour, whereas Nagel’s is about the nature of experience'],
        why: 'Jackson’s subjects (Fred, Mary) are humans, and the issue is whether complete physical information is complete — not whether we can project ourselves into a bat. The second option reverses the two conclusions.' },
      { q: 'Jackson suggests the music version of the argument. What would it look like?',
        o: ['Someone who has studied all the physics and neuroscience of music learns something on first hearing it',
            'Someone who has heard music all their life learns its physics and finds nothing new in it',
            'Two people hear the same music but have different experiences of it, though their brains match',
            'A deaf composer writes music by studying its physics, so experience isn’t needed'],
        why: 'Same structure as Mary: complete physical knowledge, then first-hand experience, then something new learned. The other cases don’t have that structure (and identical brains with different experiences would be a different argument).' }
    ],

    gap: [
      { q: 'What does Levine call the “explanatory gap”?',
        o: ['Even complete physical knowledge doesn’t explain why a physical state feels the way it does',
            'Science has not yet found the brain states that are correlated with each experience',
            'There is a gap in time between a stimulus and our conscious experience of it',
            'Philosophers and scientists use different vocabularies, so they talk past each other'],
        why: 'You can learn everything there is to know about colour and still gain understanding on first seeing it. The gap is <b>explanatory</b>: why does that physical state feel like <i>this</i>? Missing correlations would be a temporary gap in data.' },
      { q: 'Why do psychophysical identities look unlike other scientific identities, on Levine’s view?',
        o: ['“Heat is molecular motion” leaves nothing to explain, but “pain is C-fibre firing” does',
            'Psychophysical identities are definitional, while scientific identities are empirical',
            'Scientific identities are discovered by experiment, but psychophysical ones by reflection',
            'Psychophysical identities are about events, while scientific identities are about substances'],
        why: 'Once you know molecular motion plays heat’s causal role, there is nothing left to explain. With pain and C-fibres you can still ask why <i>that</i> feels like <i>this</i>. Smart insisted mental–physical identities are empirical, like scientific ones.' },
      { q: 'What kind of claims are Nagel’s, Jackson’s and Levine’s, according to the lecture, and what is at stake?',
        o: ['Claims of epistemic limits — whereas the question is what metaphysical conclusion follows',
            'Metaphysical claims — whereas what is at stake is only what science can currently explain',
            'Empirical claims — whereas the real question is about the meanings of mental words',
            'Ethical claims — whereas what is at stake is how we should treat animals like bats'],
        why: '“So far we have claims of epistemic limitations — but the problem is metaphysical.” The three responses differ on what the epistemic gap tells us about reality.' },
      { q: 'What is the dualist response to the epistemic problem of consciousness?',
        o: ['There is an epistemic gap because there is an ontological gap',
            'There is an epistemic gap because experience is an illusion',
            'There is no epistemic gap, only an ontological one',
            'There is an epistemic gap, but no ontological gap behind it'],
        why: 'Dualism (Jackson 1982, Chalmers): we can’t derive the experiential from the physical because it really is something further. “No ontological gap” is bridge-building materialism; “illusion” is illusionism.' },
      { q: 'Which kind of dualism is meant when Jackson and Chalmers are called dualists?',
        o: ['Not Cartesian substance dualism — a dualism of properties within one world',
            'Cartesian substance dualism, with a separate thinking substance for each mind',
            'Aristotle’s hylomorphism, on which the soul is the form of the living body',
            'Idealism, on which everything that exists is ultimately mental in nature'],
        why: 'The lecture marks this dualism as <b>not Cartesian</b>: there are non-physical properties (qualia) but no separate thinking substance. Idealism is a monism.' },
      { q: 'Which thinkers are named as eliminativists or illusionists about consciousness?',
        o: ['Dennett, the Churchlands and Frankish', 'Jackson, Chalmers and Nagel', 'Galen Strawson, Bertrand Russell and Arthur Eddington', 'Locke, Olson and Parfit'],
        why: 'Eliminativism/illusionism — consciousness is not what it seems — is Dennett, Paul and Patricia Churchland, and Keith Frankish. Jackson and Chalmers are the dualists.' },
      { q: 'What does bridge-building materialism say about Mary when she first sees red?',
        o: ['She learns no new fact; she gains a new perspective on something she already knew',
            'She learns a new, non-physical fact that her physical knowledge had left out',
            'She learns nothing at all, because what she seems to experience is an illusion',
            'She cannot really see red, because her visual system never developed colour vision'],
        why: 'Bridge-builders: reality is uniform but appears in different guises. Mary gets a <b>new way of grasping</b> an old fact — like Lois learning that Clark Kent is Superman. The non-physical-fact option is Jackson.' },
      { q: 'What do bridge-building materialists mean by saying reality “appears to us in different guises”?',
        o: ['One uniform reality can be grasped both through physical concepts and through experience',
            'Reality divides into a mental part and a physical part that appear together in us',
            'Appearances are illusions, and only the physical description is real',
            'Each species perceives a different reality, so there is no single world'],
        why: 'One reality, two modes of access. The materialist claim is that there is no ontological gap — only different ways of grasping the same things.' },
      { q: 'Which of the following is the <b>ability hypothesis</b> (Lewis, Nemirow) about Mary?',
        o: ['She gains new know-how — to recognise, imagine and remember red — not a new fact',
            'She gains the ability to see colours, which she was physically unable to do before',
            'She already had every relevant ability, so she gains nothing on release',
            'She gains a new fact, but one that she could have deduced from physics'],
        why: 'The ability hypothesis denies that Mary’s gain is <b>propositional</b> knowledge. Know-how isn’t knowledge of a fact, so the knowledge argument’s assumption that she learns a new fact fails.' },
      { q: 'Why is physicalism about consciousness “not obvious”, according to the lecture?',
        o: ['A particular pain is in space and time, but the property of being in pain doesn’t seem to be',
            'No experiences at all are located in space or in time, while every physical thing is located in both',
            'Physics has never studied the brain, so it says nothing about experiences',
            'Most people believe in souls, so physicalism goes against common sense'],
        why: 'The puzzle concerns <b>properties</b>: this pain happens here and now, but painfulness itself doesn’t seem to be a spatial property the way mass or charge is.' },
      { q: 'Strawson called one view “the strangest thing that has ever happened in the whole history of human thought”. Which view?',
        o: ['The denial that conscious experience exists (eliminativism)',
            'The claim that experience is present in all matter (panpsychism)',
            'The claim that minds are non-physical substances (dualism)',
            'The claim that machines could have conscious experience'],
        why: 'Strawson is aiming at those who deny consciousness — “next to this denial, every known religious belief is only a little less sensible than the belief that grass is green”. He himself is a panpsychist.' }
    ],

    strawson: [
      { q: 'What does Strawson mean by “realistic” physicalism?',
        o: ['A physicalism that takes the reality of experience as given',
            'A physicalism that only accepts what current physics describes',
            'A physicalism that denies experience exists in any form',
            'A physicalism that is supported by experimental evidence'],
        why: 'Realistic = realist about experience: experience is real, and any physicalism worth having must accept that. Restricting reality to current physics is exactly what he rejects.' },
      { q: 'How does Strawson define “physical”?',
        o: ['By pointing at examples of physical things, not by reference to current physics',
            'As whatever current physics refers to in its best confirmed theories',
            'As whatever takes up space and can be pushed by other bodies',
            'As whatever is not mental, so that “physical” and “mental” exclude each other'],
        why: 'Strawson defines the physical ostensively — by examples — because we cannot presume that physics captures everything about the physical. Defining it as “not mental” builds in the very contrast he rejects.' },
      { q: 'Strawson says physicalism is misunderstood by its opponents and its proponents. What is the shared mistake?',
        o: ['Assuming there is a contrast between the physical and the mental',
            'Assuming that physics is the right method for studying matter',
            'Assuming that experience is the most certain thing we know',
            'Assuming that the mental is fundamental and the physical derived'],
        why: 'Both sides assume the physical is non-mental, so they think physicalism must either explain experience away or fail. For Strawson, experience is itself physical.' },
      { q: 'What does it mean that physics is “functionalist in character”?',
        o: ['It describes how things relate and affect each other, not what matter is intrinsically',
            'It explains everything in terms of the purposes that things are designed to serve',
            'It describes the mental functions of organisms purely in terms of their inputs and outputs',
            'It treats every physical system as a computer running some program'],
        why: 'Physics describes relations and effects — including effects on our sense organs and instruments — and abstracts from intrinsic features. It is silent on what matter is in itself, which leaves room for experience.' },
      { q: 'Which quotation does Strawson draw from Russell?',
        o: ['Physics is mathematical not because we know so much about the physical world, but so little',
            'Physics will one day explain everything about the mind, once neuroscience is mature',
            'Matter is a permanent possibility of sensation, and nothing over and above that',
            'The mind is a ghost in the machine, and physics is the study of the machine'],
        why: 'Russell’s point: physics gives us only abstract mathematical structure. That is an <b>argument from authority</b> for Strawson’s claim that physics leaves intrinsic nature open.' },
      { q: 'What is the “layer-cake image”?',
        o: ['If the physical is fundamentally non-experiential, experience must sit at a higher, non-fundamental level',
            'Reality is made of a mental layer sitting on top of a physical layer, and the two never interact with each other',
            'Each science studies its own layer, and no layer can be reduced to the one below it',
            'Experience is spread evenly through every layer of reality, from particles to brains'],
        why: 'On the standard picture, the fundamental layer is non-experiential, so experience has to appear higher up — which means it must <b>emerge</b>. Strawson rejects that emergence.' },
      { q: 'Which is Strawson’s example of acceptable (weak) emergence?',
        o: ['The liquidity of water', 'The experience of red', 'The evolution of life', 'The mass of an atom'],
        why: 'Liquidity is intelligible in terms of how H₂O molecules behave — weak emergence. Experience from the wholly non-experiential would not be intelligible like that.' },
      { q: 'Why does Strawson reject the emergence of experience from wholly non-experiential matter?',
        o: ['It would be brute and unintelligible — strong emergence, which he finds incoherent',
            'There is no scientific evidence that experience appears anywhere in the brain',
            'Experience is too complex to emerge from simple parts in the time evolution has had',
            'Emergence of any kind conflicts with the causal closure of the physical world'],
        why: 'Genuine emergence must be intelligible: there must be something about the base in virtue of which the emergent arises. Experience from the wholly non-experiential would be brute — strong emergence, which he rejects as incoherent. He accepts weak emergence, so it isn’t emergence as such he objects to.' },
      { q: 'What is panpsychism, as Strawson arrives at it?',
        o: ['Experientiality is a fundamental feature of matter, like mass or charge, perhaps everywhere',
            'Everything that exists is a mind or an idea in a mind, so matter does not exist',
            'Every ordinary object, such as a rock or a chair, has thoughts, beliefs and desires just like ours',
            'The universe as a whole has a single mind, of which ours are parts'],
        why: 'The experiential is fundamental, so qualities like experientiality could be present everywhere — perhaps there is something it is like “from the inside” for every physical system. Panpsychism doesn’t say rocks have beliefs. And it is not idealism, since matter is real.' },
      { q: 'What did the lecturer conclude about Strawson’s argument?',
        o: ['Either way the answer is weird — strong emergence or panpsychism — and the world doesn’t care',
            'Strawson’s argument is sound, so panpsychism should now be accepted by every physicalist who is consistent',
            'Strawson’s argument shows that physicalism is false and dualism must be true',
            'Strawson’s argument is irrelevant, because it relies only on arguments from authority'],
        why: 'Either strong emergence or panpsychism; the lecturer is not convinced that rejecting strong emergence is the way to go. “The world doesn’t care about our sense of weirdness.”' },
      { q: 'Why does Strawson think physics does not capture everything there is to say about the physical?',
        o: ['Physics doesn’t capture the experiential being of anything, yet experience is physical',
            'Physics is an incomplete science that will be replaced by a better future physics',
            'Physics only studies non-living things, so it misses biological facts',
            'Physics is a human construction, so it can’t tell us about reality at all'],
        why: 'Experience is real and physical; physics says nothing about experiential being; so physics leaves something physical out. He doesn’t reject physics, only its claim to completeness.' },
      { q: 'How does Strawson’s view differ from idealism?',
        o: ['He holds that matter is real, physical and intrinsically experiential',
            'He holds that matter does not really exist, but minds and their ideas do',
            'He holds that there are two substances, mental and physical',
            'He holds that experience is an illusion created by matter'],
        why: 'Strawson is a monist and a physicalist: matter is real, and experience is part of its nature. Idealism denies matter; dualism posits two substances; illusionism denies experience.' }
    ],

    godfrey: [
      { q: 'What is Godfrey-Smith’s basic suggestion about where minds come from?',
        o: ['Minds arise out of living matter — the only kind of matter we know to be minded',
            'Minds are fundamental features of all matter, present even in the smallest particles',
            'Minds arise whenever any system runs the right kind of program',
            'Minds are non-physical, so they cannot arise from matter at all'],
        why: '“Emergence after all”: in our experience only living things are minded, so perhaps mind arises from living matter. Panpsychism is Strawson; the right program is strong AI / functionalism about mind.' },
      { q: 'What is carbon chauvinism?',
        o: ['The view that the material matters, so a silicon system couldn’t have a mind',
            'The view that only humans have minds, since only humans have language',
            'The view that living things have a special force or energy',
            'The view that minds can be built from anything at all, as long as it runs the right program'],
        why: 'Carbon chauvinism makes the stuff (carbon vs silicon) decisive. Godfrey-Smith rejects it. The “special force” option is vitalism.' },
      { q: 'What is vitalism?',
        o: ['The view that living things have a special “force” or “energy”',
            'The view that every living thing is conscious to some degree',
            'The view that life is a cluster of features such as metabolism',
            'The view that only carbon-based matter can be alive'],
        why: 'Vitalism posits a special life force. Godfrey-Smith rejects it; his view of life is functionalist (a cluster concept). The last option is closer to carbon chauvinism.' },
      { q: 'What does it mean to say that life is a cluster concept?',
        o: ['Living things share enough of a cluster of features, like metabolism and reproduction',
            'Life is a cluster of cells, so anything that is made of cells counts as alive by definition',
            'Life can only be defined by listing the species that biologists recognise',
            'Life is a vague concept, so there is no fact about what is alive'],
        why: 'A cluster concept is applied when enough of a cluster of features are present. It goes with a <b>functionalist view of life</b>: what living things do, not a special stuff or force.' },
      { q: 'Why does the rise of AI challenge Godfrey-Smith’s approach?',
        o: ['If machines can have minds, life is not the key to understanding mind and consciousness',
            'AI has shown that consciousness is an illusion produced by information processing',
            'AI systems are alive, so the definition of life has to be widened to include them',
            'AI has solved the problem of other minds by giving us a model of the brain'],
        why: 'His view ties mind to living systems. If non-living machines could have minds, that tie would be broken — hence the importance of his reply to Chalmers.' },
      { q: 'What does Chalmers’ neuron-replacement argument conclude?',
        o: ['Swapping neurons for functionally equivalent electronic parts would leave experience unchanged',
            'Replacing neurons with electronic parts would gradually cause experience to fade away unnoticed',
            'Electronic parts can never replace neurons, because neurons are alive',
            'Experience is located in individual neurons, so replacing one changes experience'],
        why: 'Chalmers argues that experience can’t fade or change while behaviour (and sincere reports) stay the same, so functional organisation suffices for experience. Fading is the scenario he calls absurd.' },
      { q: 'How does Godfrey-Smith respond to Chalmers’ neuron-replacement argument?',
        o: ['He rejects its premise: electronic neurons won’t be functionally equivalent to biological ones',
            'He accepts it, and concludes that suitable computers would have conscious experience',
            'He rejects its conclusion: experience would fade even if function were preserved',
            'He rejects it as meaningless, since no one could carry out the replacement'],
        why: 'He denies that functionally equivalent electronic replacements are possible. Rejecting the conclusion while granting the premise would make him a carbon chauvinist, which he isn’t.' },
      { q: 'Why, according to Godfrey-Smith, can’t electronics replicate biological neurons?',
        o: ['Electronics doesn’t operate on the principles needed to replicate them',
            'We don’t yet understand biological neurons well enough to copy them',
            'Electronic parts are artificial, and minds can only arise naturally',
            'Electronic parts are made of silicon, and minds need carbon chemistry'],
        why: 'It is not lack of understanding, not artificiality, and not the material: it is the <b>principles of operation</b>.' },
      { q: 'Which statement best captures Godfrey-Smith’s position on artificial minds?',
        o: ['What matters is not artificiality but whether a system works on the principles living nervous systems do',
            'No artificial system could ever have a mind, whatever it is made of or how it works',
            'Any artificial system that behaves like a person must have a mind like a person’s',
            'Artificial minds are already here, since large computers have more processing power than brains'],
        why: 'Not artificiality but principles of operation: an artificial system working like a nervous system could be a candidate; a digital computer is not.' },
      { q: 'Which differences between brains and digital computers does the lecture mention?',
        o: ['Neurons versus a CPU, and differences in how information is stored',
            'Brains are faster than computers and have far more memory',
            'Computers are conscious but brains only simulate consciousness',
            'Brains run software, while computers have no software at all'],
        why: 'The lecture: brains are very different from digital computers — CPU vs neurons, storage and so on. These differences support the claim that they run on different principles.' },
      { q: 'How does Godfrey-Smith’s view relate to Strawson’s?',
        o: ['He takes the horn Strawson rejects: experience emerges from living nervous activity',
            'He agrees with Strawson that experience must be present in all fundamental matter',
            'He agrees with Strawson that experience is an illusion created by language',
            'He rejects both emergence and panpsychism, and so becomes a substance dualist'],
        why: 'The lecture framed the options as strong emergence or panpsychism. Strawson chooses panpsychism; Godfrey-Smith, “emergence after all”, grounds experience in living systems.' }
    ],

    locke: [
      { q: 'In the sense used in the lectures, what is identity?',
        o: ['The relation everything has to itself and to no other thing',
            'The relation between two things that are exactly alike',
            'The relation between a thing and the sort it belongs to',
            'The relation between a person and their memories'],
        why: 'Numerical identity: Superman is Clark Kent — one thing. Not the sense in which identical twins are “identical” (exact similarity between two things).' },
      { q: 'What does the identity of indiscernibles say?',
        o: ['There cannot be two things that are exactly alike',
            'If x is identical to y, then x and y are exactly alike',
            'Two things can be exactly alike without being identical',
            'Nothing stays exactly alike across a change in time'],
        why: 'Identity of indiscernibles: exactly alike → identical. The second option is the converse — the <b>indiscernibility of identicals</b>, Leibniz’s law. The two are often conflated.' },
      { q: 'Which principle is Leibniz’s law?',
        o: ['The indiscernibility of identicals: if x is numerically identical to y, they are exactly alike',
            'The identity of indiscernibles: if x and y are exactly alike, they are one and the same thing',
            'The principle that every substance has its identity fixed by its time and place of origin',
            'The principle that a person is the same person as anyone whose experiences they remember'],
        why: 'Leibniz’s law = the indiscernibility of identicals. Its converse, the identity of indiscernibles, is the more controversial one (Leibniz appealed to God).' },
      { q: 'What is the difference between synchronic and diachronic identity questions?',
        o: ['Synchronic ask what a thing is at a time; diachronic ask what makes it the same over time',
            'Synchronic are about minds; diachronic are about bodies and other material things',
            'Synchronic are answered by memory; diachronic are answered by sortal concepts',
            'Synchronic ask whether two things are alike; diachronic ask whether they are one'],
        why: 'Synchronic (at a time): what am I? — answered with a sortal. Diachronic (across time): is A at t1 the same as B at t2? — which involves understanding change.' },
      { q: 'Why can diachronic identity seem to violate Leibniz’s law?',
        o: ['The same thing has different properties at different times, yet identicals must be exactly alike',
            'Things that are exactly alike at different times must be numerically distinct things',
            'Memories can be false, so we can’t know which earlier thing someone is identical to',
            'Diachronic identity is defined using sortals, and Leibniz’s law doesn’t mention sortals'],
        why: 'I was short at five and am tall now — but if I am that child, Leibniz’s law says we must share every property. So diachronic identity requires an account of <b>change</b>.' },
      { q: 'Which three sorts of substance does Locke say we have ideas of?',
        o: ['God, finite intelligences, and bodies',
            'Minds, bodies, and living things',
            'Persons, men, and masses of matter',
            'Souls, atoms, and organisms'],
        why: '“We have the ideas but of three sorts of substances: 1. God, 2. Finite Intelligences, 3. Bodies.” Persons, men and masses of matter are kinds whose identity he discusses separately.' },
      { q: 'According to Locke, what happens to the identity of a mass of matter if it loses a single atom?',
        o: ['It is no longer the same mass of matter',
            'It is the same mass, as long as its shape is unchanged',
            'It is the same mass, as long as it keeps the same life',
            'It is the same mass, as long as it is remembered as such'],
        why: 'A complex body’s identity is the identity of the particles composing it, so it cannot lose or gain a single atom. That is why the Ship of Theseus doesn’t survive, on this view.' },
      { q: 'What does Locke say determines the identity of a living thing (a plant or an animal) over time?',
        o: ['The continuation of the same life processes, even as its matter changes',
            'The persistence of exactly the same particles of matter, with none lost',
            'The time and place at which it first began to exist',
            'The memories it has of its own past experiences'],
        why: 'Living things persist as long as the same life goes on, though their matter is constantly replaced. Same particles is his criterion for masses of matter; time and place of origin is for finite spirits and particles.' },
      { q: 'What is the memory theory of personal identity?',
        o: ['A at t1 is the same person as B at t2 if and only if B remembers being A',
            'A at t1 is the same person as B at t2 if and only if they have the same body',
            'A at t1 is the same person as B at t2 if and only if they have the same soul',
            'A at t1 is the same person as B at t2 if and only if A can predict what B will do'],
        why: 'Locke: consciousness extends as far back as memory reaches. Personal identity is <b>not</b> determined by the body or the soul — which makes the theory neutral on the mind–body problem.' },
      { q: 'Why is the memory theory neutral regarding the mind–body problem?',
        o: ['It makes identity depend on memory, whatever the memories are realised in',
            'It shows that the mind and the body are one and the same thing',
            'It treats memories as physical traces, so it presupposes materialism',
            'It treats memories as states of a soul, so it presupposes dualism'],
        why: 'Identity depends on the memory relation, not on the substance that has it — soul or brain. So you could be a dualist or a materialist and accept it.' },
      { q: 'How does the memory theory deal with the fact that we forget our early childhood?',
        o: ['It broadens memory to psychological continuity — overlapping chains of memory',
            'It accepts that adults are not the same people as the children they were',
            'It says childhood memories are still stored, so they still count',
            'It replaces memory with bodily continuity for the early years'],
        why: 'I don’t remember being two, but I remember being ten, and at ten I remembered being five, and so on. Overlapping chains give <b>psychological continuity</b>.' },
      { q: 'What is the circularity problem for the memory theory?',
        o: ['Genuine memory is of one’s own past, so defining identity by it presupposes identity',
            'Memories are caused by brain states, so the theory presupposes materialism',
            'People remember things that never happened, so memory can’t be trusted',
            'Every memory is a memory of another memory, so the chain never reaches an actual experience'],
        why: 'What makes a memory real rather than confabulated? That I actually had the experience — which already assumes I am the earlier person. False memories are the symptom; the objection is that identity is built into “memory”.' },
      { q: 'What is a quasi-memory (q-memory)?',
        o: ['A memory-like state, without the requirement that the experience was one’s own',
            'A memory that is vague or partial, so that it is not quite a full memory',
            'A memory that we are unsure of, and which therefore needs confirming by other people',
            'A false memory that someone has been led to believe through suggestion'],
        why: 'A q-memory is memory-like without the requirement that the experience be the rememberer’s own. That is how it avoids presupposing identity. It need not be vague or false.' }
    ],

    olson: [
      { q: 'What is animalism?',
        o: ['You are a human animal — a biological organism',
            'You are a mind that is related to a human animal',
            'Animals have minds just as much as humans do',
            'Humans are animals, but persons are something more'],
        why: 'Olson: you aren’t just related to a living organism — you <b>are</b> one. Persistence conditions are biological, not psychological.' },
      { q: 'What kind of account of personal identity is animalism?',
        o: ['A non-psychological account: you persist as long as the organism does',
            'A psychological account: you persist as long as your memories do',
            'A dualist account: you persist as long as your soul does',
            'A narrative account: you persist as long as your life story does'],
        why: 'Animalism is a <b>non-psychological</b> account. Psychological continuity is neither necessary nor sufficient for you to persist.' },
      { q: 'What does animalism say about a teletransporter that scans you, destroys your body and builds a duplicate elsewhere?',
        o: ['It is a way to die, not a way to travel, because the organism is annihilated',
            'It is a way to travel, because your memories and personality are preserved',
            'It is a way to travel, as long as only one duplicate is ever made',
            'It is a way to split into two, one person at each end of the journey'],
        why: 'The organism is annihilated, so you cease to exist. The memory theory says you travel — and has trouble if two people are created on the other side.' },
      { q: 'What is the first premise of the thinking animal argument?',
        o: ['There is a human animal sitting in your chair',
            'You are the thinking thing sitting in your chair',
            'The human animal in your chair is thinking',
            'Only one thing is thinking in your chair'],
        why: 'P1: a human animal is in your chair. P2: that animal is thinking. P3: you are the thinking thing in your chair. C: you are the human animal.' },
      { q: 'Who is most likely to deny that the human animal in your chair is thinking?',
        o: ['A substance dualist, for whom only an immaterial soul thinks',
            'An eliminativist, for whom there are no human animals',
            'A memory theorist, for whom animals cannot have memories',
            'A panpsychist, for whom everything is thinking'],
        why: 'The notes: substance dualists may deny premise 2. Memory theorists typically accept that animals think; the argument is meant to squeeze them on premise 3.' },
      { q: 'Why does Olson say denying the first premise of the thinking animal argument is too costly?',
        o: ['There would be no human animals at all — implications that are too big',
            'It would mean you are not thinking at all, which contradicts the Cogito',
            'It would mean that animals cannot think, which biology refutes',
            'It would mean that you have no body, which is plainly false'],
        why: 'Deny that a human animal is sitting in your chair and you must deny there are human animals — the implications are too big.' },
      { q: 'What are the lump of bronze and the bronze statue an example of?',
        o: ['Coincident but distinct objects: two things in one place, made of the same matter',
            'Numerically identical objects: one thing described in two different ways',
            'Qualitatively identical objects: two exactly alike things in different places',
            'A phase sortal: the same thing described at two different times'],
        why: 'The constitution view: the lump and the statue occupy the same place but are distinct (the lump could survive being squashed; the statue couldn’t). Olson denies that you and your animal are like this.' },
      { q: 'What does Olson mean by calling “person” a phase sortal?',
        o: ['Like “child” or “teenager”, it applies to some animals for some of their lives',
            'Like “animal”, it gives the persistence conditions of the things it applies to',
            'Like “statue”, it applies to something constituted by an animal',
            'Like “soul”, it applies to something that can survive the death of the body'],
        why: 'A phase sortal applies to a thing during a phase of its existence. Intelligence and reflection are capacities some animals have for part of their lives. “Animal” is the substance sortal that gives your persistence conditions.' },
      { q: 'Which was once true of you, according to animalism?',
        o: ['You were once a foetus without any psychological capacities',
            'You were once a soul that existed before your body did',
            'You were once a different person with different memories',
            'You were once two people, before your hemispheres developed'],
        why: 'If you are the organism, you were the foetus that the organism once was — even though it had no psychology. Psychological theories have to deny this.' },
      { q: 'What does animalism imply about a memory swap between two people’s bodies?',
        o: ['Each person stays with their own body, now with someone else’s memories',
            'Each person goes with their memories into the other body',
            'Both people cease to exist, and two new people are created',
            'It is indeterminate who is who, since both views are equally good'],
        why: 'You go where the organism goes. Memories are not what make you you, so animalism doesn’t support the memory-continuity theory.' },
      { q: 'If the animal in your chair thinks and you are something else, what problem arises?',
        o: ['There would be two thinkers in your chair, and you couldn’t tell which you are',
            'There would be no thinkers in your chair, because the animal is not a person',
            'You would have no body, so you could not be sitting in the chair',
            'The animal would have your memories, so it would be you after all'],
        why: 'Too many thinkers: the animal thinks your thoughts, and so do you. How would you know you are the person and not the animal? This is why Olson thinks premise 3 is hard to deny.' },
      { q: 'Which theorist would most clearly agree that you could survive in a persistent vegetative state?',
        o: ['Olson', 'Locke', 'Parfit', 'Dennett'],
        why: 'The organism survives, so on animalism you survive. On Locke’s or Parfit’s psychological views, with no psychology left, the person does not.' }
    ],

    dennett: [
      { q: 'What is Dennett sceptical of?',
        o: ['The idea of a self, as some extra thing inside us', 'The existence of minds and mental states', 'The claim that humans are animals', 'The claim that the brain causes all of our behaviour'],
        why: 'Dennett is a materialist, sceptical of a self. Walk around inside the brain and you won’t find one. He doesn’t deny minds or that the brain causes behaviour.' },
      { q: 'On Dennett’s view, if there were a self, what would it have to be?',
        o: ['Either part of an animal or the whole of an animal',
            'A non-physical soul that is attached to the brain',
            'A pattern in the memories of other people',
            'A program that could run on any computer'],
        why: 'As a materialist, Dennett holds that a self would have to be part or the whole of the animal. Neither seems to fit what we mean by “self”.' },
      { q: 'What is Dennett’s “minimal self”?',
        o: ['An organisation that tends to distinguish, control and preserve portions of the world',
            'The narrative a person consciously tells about their own life, character and future plans',
            'The part of the brain responsible for self-awareness',
            'The soul, stripped of all memories and personality'],
        why: 'The minimal self is abstract: just the existence of an organisation that keeps a boundary between self and world — as living systems do. It could apply to machines, or countries.' },
      { q: 'Why are living systems “inherently self-like” for Dennett?',
        o: ['They maintain their boundaries, distinguishing themselves from the rest of the world',
            'They are conscious of themselves, as shown by their reports',
            'They have narratives about themselves that guide their behaviour from moment to moment',
            'They contain a self, located somewhere in the nervous system'],
        why: 'Boundary maintenance — a cell membrane, an immune system — is the root of selfhood. That is the minimal self, and it needs no consciousness or language.' },
      { q: 'What does Dennett say is characteristic of human selfhood?',
        o: ['Self-protective strings of narrative, in words',
            'A unified conscious perspective on the world',
            'A soul that persists through bodily change',
            'A brain region devoted to self-recognition'],
        why: 'The human self is the product of narrative — words. Not a conscious storytelling process; the narratives are produced in us more than by us.' },
      { q: 'Why does Dennett call the self a “centre of narrative gravity”?',
        o: ['Like a centre of gravity, it is a useful abstraction, not a physical part of anything',
            'Like gravity, it is a force that pulls our experiences together into one place',
            'Like a planet’s centre, it is located at the physical centre of the brain',
            'Like gravity, it can be measured precisely once we have the right instruments'],
        why: 'A centre of gravity is not a bit of the object — it is an abstraction that is objective and useful for prediction. The self is like that: a theorist’s fiction around which our stories are organised.' },
      { q: 'What follows, for Dennett, from the fact that the narrative self depends on language?',
        o: ['Non-linguistic creatures lack this kind of self',
            'Every creature with a brain has a narrative self',
            'Selves can exist without any brain at all',
            'Only one language can produce a self'],
        why: 'No words, no narrative self — though non-linguistic creatures can still have a minimal (biological) self.' },
      { q: 'How does Dennett’s view account for dissociative identity disorder?',
        o: ['The narrative self is a contingent capacity of the brain, so a brain can spin more than one',
            'It shows that each person has two souls, one of which normally lies dormant',
            'It shows that the self is located in a particular brain region that can be damaged',
            'It is a disorder of memory, so it says nothing about the self at all'],
        why: 'If the self is a centre of narrative gravity, nothing prevents one brain from producing two (or more) narrative centres. That is a predicted consequence, not an embarrassment.' },
      { q: 'Which word does the lecture use for the narrative self on Dennett’s view, though Dennett himself doesn’t?',
        o: ['Epiphenomenal', 'Strongly emergent', 'Fundamental', 'Immaterial'],
        why: 'If the self is a fiction we have little control over, it does no causal work — it becomes epiphenomenal. That is exactly what Ismael objects to.' },
      { q: 'What is Ismael’s main objection to Dennett?',
        o: ['A self-steering system must represent itself, so self-representation isn’t idle',
            'The self is a non-physical thing, so it cannot be a fiction or an abstraction at all',
            'Narratives are consciously composed, so the self is under our control',
            'Animals have narrative selves too, so the self does not depend on language'],
        why: 'Ismael: Dennett throws the baby out with the bathwater. Our self-representation guides us through the world; a self-steering system needs it. Constructed, yes; idle, no.' },
      { q: 'What does Ismael add about the social dimension of the self?',
        o: ['We construct a self partly to represent ourselves in our relations with each other',
            'The self is entirely created by society, so individuals have no selves alone',
            'Other people’s memories of us determine who we are over time',
            'Society is itself a self, in the same sense that an organism is'],
        why: 'Self-construction has a social dimension: self-representation lets us take part in relationships (commitments, reputations, roles). She doesn’t say society creates the self entirely.' }
    ],

    parfit: [
      { q: 'What is a fission event, in Parfit’s sense?',
        o: ['An event that causes two copies of someone’s psychology to exist elsewhere',
            'An event that splits someone’s memories so that half are lost forever',
            'An event in which two people’s psychologies are merged together into a single body',
            'An event in which a person’s body splits but their mind stays whole'],
        why: 'In fission, two people each end up psychologically continuous with the original — for example, each receives one hemisphere of the brain.' },
      { q: 'What is Parfit’s central claim about identity?',
        o: ['Identity matters less than we think',
            'Identity is an illusion and does not exist',
            'Identity is determined by the body alone',
            'Identity is the most important thing in ethics'],
        why: 'Parfit doesn’t deny that people persist; he denies that identity is what matters. What matters is psychological connectedness and continuity.' },
      { q: 'Why do we care about identity, according to Parfit?',
        o: ['It seems to ground regret, anticipation of pain, and praise',
            'It is a deep metaphysical fact that we perceive directly',
            'It is required by the law, which holds people responsible for their own past acts',
            'It is needed to explain how memory works in the brain'],
        why: 'Identity seems to be the ground of important attitudes and emotions — regret, pain, praise. But that reliance is a conceptual shortcut, a contingent convenience.' },
      { q: 'What is psychological connectedness?',
        o: ['Direct psychological links, such as episodic memory and intentional control',
            'Overlapping chains of direct psychological links stretching over a whole life',
            'Having the same personality traits at two different times',
            'Being connected to the same body over time'],
        why: 'Connectedness = direct links (I remember that experience; I carry out what I intended). Overlapping chains of them make <b>continuity</b>.' },
      { q: 'What is psychological continuity?',
        o: ['Overlapping chains of psychological connectedness',
            'Direct memory of every earlier stage of one’s life',
            'Having exactly the same beliefs and desires over time',
            'Continuity of the brain’s physical structure'],
        why: 'Continuity is the chain; connectedness the links. I can be continuous with my childhood self without being strongly connected to it.' },
      { q: 'How does Parfit define identity?',
        o: ['Non-branching psychological continuity',
            'Psychological connectedness of any strength',
            'Continuity of the same living organism',
            'Possession of the same soul over time'],
        why: 'Identity = <b>non-branching</b> psychological continuity. The non-branching clause handles fission: when continuity branches, neither branch is identical to the original.' },
      { q: 'What does Parfit conclude about fission?',
        o: ['Neither survivor is the original, but nothing that matters has been lost',
            'Both survivors are the original, so one person can be in two places',
            'One survivor is the original, though we can never know which one',
            'The original dies, and that is just as bad as ordinary death'],
        why: 'By the non-branching clause, neither is identical to the original. But each has all the connectedness and continuity that ordinary survival involves — so identity is not what matters.' },
      { q: 'How does psychological connectedness behave over a single life, according to Parfit?',
        o: ['It can weaken over time, since it comes in degrees',
            'It stays constant from birth until death',
            'It increases steadily over a life as we gain more memories',
            'It is all-or-nothing, like identity'],
        why: 'Connectedness comes in degrees and can weaken within a single life. Identity, by contrast, is all-or-nothing.' },
      { q: 'What is Parfit’s motivation for arguing that identity matters less than we think?',
        o: ['Ethical: egoism and self-interest should have less hold on us',
            'Scientific: neuroscience has shown that there is no self',
            'Religious: belief in an afterlife requires a soul',
            'Legal: people should not be punished for past crimes'],
        why: 'If our relation to our future and past selves is indirect and a matter of degree, self-interest should have less hold on us — and if the self is a construction, we are partly responsible for it.' },
      { q: 'Which view of what identity <i>consists in</i> does Parfit hold?',
        o: ['A Lockean, psychological view', 'An animalist, biological view', 'A Cartesian, soul-based view', 'A narrative, fictional view'],
        why: 'Parfit holds a Lockean view: identity consists in psychological continuity (non-branching). His distinctive claim is about whether identity matters.' },
      { q: 'If the self is a construction, what follows for Parfit?',
        o: ['We are at least partly responsible for it',
            'It does not exist and can be ignored',
            'It is fixed at birth and cannot change',
            'It is identical to the body that constructs it'],
        why: 'The notes: “if the self is a construction, we are at least partly responsible for it” — one strand of Parfit’s ethical motivation.' }
    ]
  };

  /* ======================== hard multiple choice ==========================
     Application, argument-structure and cross-thinker questions rather than
     definitions. Same shape as MCQ, except the "I / II" statement questions,
     which give the correct index in `a` and keep their options in order. */

  var twoStatements = global.ARTS3367Kit.twoStatements;

  var HARD = {
    nagel: [
      { q: 'A neuroscientist says: “Once we have mapped every neuron in a bat, we’ll know what echolocation is like — we’ll just have to read the map.” What is Nagel’s best reply?',
        o: ['The map is objective: read from our point of view, it gives facts, not the bat’s subjective character',
            'The map could never be complete, since bat brains are too complex for any human science to describe',
            'Bats probably lack experience, so the map would show there is nothing it is like to echolocate',
            'Reading the map would tell us what echolocation is like, but only after we had ourselves learned to echolocate'],
        why: 'Nagel grants perfect physiological knowledge for the sake of argument. The problem is in principle: the map is an objective description, and the bat’s experience is graspable only from its type of point of view. Completeness and complexity are beside the point.' },
      { q: 'Smart used “lightning is electrical discharge” as a model for “pain is a brain process”. How does Nagel’s use of the same kind of example differ?',
        o: ['For Nagel it shows why such reductions work — appearances can be set aside — and so why experience can’t follow the model',
            'For Nagel it shows that every identity is definitional, so “pain is a brain process” could never be discovered',
            'For Nagel it shows that lightning, like pain, has a subjective character that physics cannot capture',
            'For Nagel it shows that identities between kinds are impossible, so only token identities are acceptable'],
        why: 'Reduction of lightning or heat succeeds by setting aside how the phenomenon appears to us and describing the same thing objectively. For experience, the appearance <i>is</i> the phenomenon, so the model that worked for Smart breaks down.' },
      twoStatements('Which of the following statements about Nagel are correct?',
        'Nagel’s argument would lose all its force if it turned out that bats have no experience at all.',
        'Nagel holds that there are facts about experience that humans may be unable to know or even conceive.',
        1,
        'II only. I is false: bats just make the point vivid. Any experience, including human experience, has a subjective character tied to a point of view, so the argument doesn’t depend on bats. II is true: Nagel argues there are facts about bat experience we cannot know or conceive, because our concepts are limited by our possible experience.'),
      { q: 'Which discovery would do most to undermine Nagel’s argument?',
        o: ['An objective description of experience that told us what echolocation is like without having it',
            'Some blind humans learning to echolocate, so that at least a few people know roughly what it is like',
            'Brain states being found that correlate perfectly with each kind of bat experience',
            'Bats turning out to have far simpler experiences than scientists had assumed'],
        why: 'The key premise is that what-it’s-like is graspable only from a point of view. An objective description that conveyed it would refute that premise. Human echolocators would just widen the set of sharers of the bat’s point of view — the subjectivity premise still stands. Correlations are something Nagel already allows.' },
      { q: 'Nagel thinks we grasp a bat’s pain better than its echolocation. What does this imply about his notion of subjectivity?',
        o: ['It comes in degrees: a fact is more accessible the more similar your type of point of view',
            'It is all-or-nothing: either a fact is graspable only by its subject or by everyone',
            'Pain is objective, since it can be fully described in terms of behaviour',
            'Echolocation is not an experience but a mechanism, so it has no subjective side'],
        why: 'Subjectivity is relative to types of point of view, so it comes in degrees: shared mammalian physiology gives partial access to bat pain; nothing gives us access to echolocation. Pain doesn’t become objective — it is just a shared type.' },
      { q: 'A critic says: “Nagel can’t consistently believe physicalism might be true while claiming that a physical description can’t capture experience.” What is the best reply on Nagel’s behalf?',
        o: ['He claims only that we can’t now understand how it could be true; a true claim can outrun our concepts',
            'He was simply inconsistent, and in the end committed himself to dualism without saying so',
            'He holds that physicalism is true only of bats and other animals, not of human beings',
            'He believes experience will turn out to be non-physical, but that physics will expand to include it'],
        why: 'Like “matter is energy” to a pre-Socratic, physicalism may be true though we lack the concepts to understand how. The claim is epistemic — about our understanding — not that physicalism is false.' }
    ],

    jackson: [
      { q: 'On Jackson’s 1982 view, Mary sees a red tomato for the first time and exclaims “So <i>that’s</i> what red is like!” What causes the exclamation?',
        o: ['The brain process triggered by the tomato — the same process that also causes her red quale',
            'Her red quale, acting on her speech centres through a special non-physical causal route',
            'Her red quale together with the brain process, each a partial cause that needs the other',
            'Nothing physical — the exclamation is itself an epiphenomenon of her new experience'],
        why: 'Qualia are epiphenomenal: caused by brain processes, causing nothing physical. So her words, like all behaviour, are caused by the brain process — which also causes the quale. Making the quale a cause, even a partial one, abandons epiphenomenalism.' },
      { q: 'Given that answer, why is Mary’s case awkward for Jackson’s combination of the knowledge argument with epiphenomenalism?',
        o: ['Her judgement is caused physically and would occur without the quale — so how is it knowledge of the quale?',
            'If the quale causes nothing, Mary cannot learn any physical facts on release, so the argument has no premise',
            'If the brain process causes the exclamation, Mary must have already known what red was like inside the room',
            'If qualia have no effects, they could not have been selected by evolution, which Jackson never addresses'],
        why: 'Her belief and her words come from the brain process alone; they would occur if the quale were absent. Knowledge normally needs some link to what is known, so it is hard to see how she comes to know the quale — the very knowledge the argument relies on. (Jackson did address evolution, with the polar bear.)' },
      twoStatements('Which of the following statements are correct?',
        'The ability hypothesis grants that Mary gains something when she first sees red.',
        'Bridge-building materialism grants that, before release, Mary already knew all the facts about colour vision.',
        2,
        'Both. I: on the ability hypothesis she gains know-how — to recognise, imagine and remember red — just not a new fact. II: bridge-builders say she knew every fact already and gains only a new perspective on one of them. Neither reply needs to deny that something changes for Mary.'),
      { q: 'Dennett suggests that if Mary really knew <i>all</i> the physical information, she wouldn’t be surprised when shown red (and could spot a trick blue banana). Which premise does this target?',
        o: ['That Mary learns something new on release',
            'That all knowledge is knowledge of facts',
            'That Mary knows all the physical information',
            'That physicalism means all information is physical'],
        why: 'Dennett grants that she knows everything physical and denies she would learn anything — we just can’t imagine what knowing <i>everything</i> would be like. The ability hypothesis, by contrast, targets the assumption that all knowledge is factual.' },
      { q: 'In Jackson’s newspaper analogy for other minds, what corresponds to the second newspaper’s report?',
        o: ['The other person’s qualia', 'The other person’s behaviour', 'The other person’s brain process', 'The observer’s own qualia'],
        why: 'One paper’s report is evidence of another’s because both are caused by the same event. The brain process is the event; behaviour is the report I can read; the qualia are the other report, inferred via their common cause.' },
      { q: 'A critic says: “The polar bear’s heavy coat does have physical effects — it slows the bear down — so the analogy with causally inert qualia fails.” What is the best reply for Jackson?',
        o: ['It only needs to show that a trait can be a by-product of a selected one; effects are beside the point',
            'The heaviness has no effects either, since only the coat as a whole can cause anything at all',
            'Qualia do have effects, but only on other qualia, so they are in fact exactly like the heaviness after all',
            'The polar bear example was about other minds, not evolution, so the objection misreads it'],
        why: 'The evolutionary objection says qualia could only exist if selected. The polar bear shows a trait can exist as a by-product of a selected trait (warmth). Whether by-products also have effects is irrelevant to that point.' }
    ],

    gap: [
      { q: 'Lois Lane is surprised to learn that Clark Kent is Superman. A dualist objects to using this case to model Mary. What is the strongest form of the objection?',
        o: ['Lois grasps one man via two properties; if Mary’s new way of grasping red is a property, it may be non-physical',
            'Lois is learning about a fictional character, so the case tells us nothing about real colour experience',
            'Lois never had complete physical knowledge of Clark Kent, so the cases are not comparable',
            'Lois gains a new ability rather than a new perspective, so the case really supports the ability hypothesis instead'],
        why: 'Lois’s two ways of thinking of the man are fixed by different properties (mild reporter; caped flyer). If Mary’s new perspective is likewise fixed by a property — how red looks — the dualist asks whether that property is physical. The gap then reappears at the level of the mode of presentation.' },
      { q: 'Why does “heat is molecular motion” leave nothing further to explain, on Levine’s view?',
        o: ['Our concept of heat is of whatever plays heat’s causal role, so finding what plays it answers the question',
            'Heat is something we can measure with instruments, whereas pain can only be felt by its subject',
            'Heat and molecular motion are perfectly correlated, and correlation is all that explanation requires',
            'Heat is an older concept than pain, so scientists have had more time to explain it fully'],
        why: 'Heat is understood in terms of its causal role (causing expansion, burns, readings). Discovering that molecular motion plays that role explains heat completely. What it’s like to be in pain doesn’t seem to be a causal role, so finding the C-fibres that play pain’s role leaves something over.' },
      { q: 'Three philosophers comment on Mary. A: “She learns a new fact, and it isn’t physical.” B: “She learns an old fact in a new way.” C: “What she seems to discover isn’t what it seems.” Which positions are these?',
        o: ['A: dualism; B: bridge-building materialism; C: eliminativism/illusionism',
            'A: bridge-building materialism; B: dualism; C: eliminativism/illusionism',
            'A: dualism; B: eliminativism/illusionism; C: bridge-building materialism',
            'A: eliminativism/illusionism; B: bridge-building materialism; C: dualism'],
        why: 'Dualism: the epistemic gap reflects an ontological gap, so a new non-physical fact. Bridge-building: one uniform reality appearing in a new guise. Illusionism: consciousness is not what it seems.' },
      twoStatements('Which of the following statements are correct?',
        'If Levine’s explanatory gap is real, it follows directly that physicalism is false.',
        'An illusionist can hold that there is no genuine explanatory gap left to close.',
        1,
        'II only. I is false: Levine’s gap is explanatory (epistemic); getting a metaphysical conclusion needs an extra step, which bridge-builders and Nagel refuse. II is true: if consciousness isn’t what it seems, the thing that seemed unexplained isn’t there in that form.'),
      { q: 'A physicalist argues: “Vitalists thought life couldn’t be physical, and that gap closed. The explanatory gap for consciousness will close too.” What is the best reply from Levine’s side?',
        o: ['Life was a matter of functions mechanisms can perform; what experience is like doesn’t look like a function',
            'Vitalism was never refuted, so the analogy shows that consciousness also needs a special force',
            'Life has been explained only for simple organisms, so the gap for life has not really closed either',
            'The analogy is fine, but consciousness is far more complex than life, so it will simply take longer to explain'],
        why: 'Metabolism and reproduction are things living systems <i>do</i>; once mechanisms that do them were found, nothing was left over. The explanatory gap is that what-it’s-like seems not to be a doing at all. “More complex” misses the point: the worry is in principle.' },
      { q: 'This pain occurs in a brain at a time, but the property of being in pain doesn’t seem to be located anywhere. Which Test 1 distinction does this puzzle draw on?',
        o: ['Token identity is easy to accept for particular pains; type identity of the property is the hard part',
            'Weak emergence is easy to accept for properties; strong emergence is the hard part for particular pains',
            'Methodological behaviourism handles particular pains; philosophical behaviourism handles the property',
            'Supervenience holds for the property of pain; identity holds only between particular pains'],
        why: 'Each pain, as an event, can be a brain event (token identity, as for Davidson). The puzzle is the <b>property</b>: identifying painfulness with a physical property is type identity, which is where physicalism stops being obvious.' }
    ],

    strawson: [
      { q: 'A critic: “Strawson just redefines ‘physical’ so that experience counts — physicalism wins by definition.” What is the best reply?',
        o: ['It only drops the assumption that physical means non-mental; the anti-emergence argument does the real work',
            'Every philosopher must define “physical” somehow, so redefining it can’t be objected to',
            'Strawson’s definition comes from current physics, so it is not a redefinition',
            'Strawson admits the conclusion is trivial, and offers it only as a verbal suggestion about how to use “physical”'],
        why: 'Defining the physical by examples removes a question-begging contrast. The substantive conclusion — panpsychism — comes from the claims that physics leaves intrinsic nature open and that experience can’t emerge from the wholly non-experiential. Those are not true by definition.' },
      { q: 'Which premise of Strawson’s argument does Godfrey-Smith’s position reject?',
        o: ['That experience can’t intelligibly emerge from wholly non-experiential matter',
            'That experience is real and is the most certain thing we know',
            'That physics describes only structure and relations rather than intrinsic nature',
            'That every real concrete phenomenon is physical'],
        why: 'Godfrey-Smith takes “emergence after all”: experience arises from the activity of living nervous systems. He has no quarrel with realism about experience or with physicalism.' },
      twoStatements('Which of the following statements about Strawson are correct?',
        'Strawson accepts that physics is true as far as it goes.',
        'Strawson’s panpsychism implies that rocks and chairs have thoughts and beliefs.',
        0,
        'I only. I: physics is true but incomplete — it is silent on intrinsic nature. II: panpsychism says experientiality is fundamental, possibly everywhere; it doesn’t say every object has a unified mind with beliefs. A rock may have experiential constituents without itself being a thinker.'),
      { q: 'What role does Russell’s remark (physics is mathematical because we know so little) play in Strawson’s argument?',
        o: ['It blocks the step from “physics mentions no experience” to “matter is non-experiential”',
            'It shows that physics is false, so we should rely on introspection instead',
            'It shows that experience must itself be mathematical, like everything else physics describes',
            'It proves that matter does not exist apart from our knowledge of it'],
        why: 'If physics gives only structure, its silence about experience tells us nothing about matter’s intrinsic nature. That keeps open the possibility that matter is intrinsically experiential.' },
      { q: 'Which objection targets Strawson’s conclusion rather than one of his premises?',
        o: ['Even if particles have experiential being, it’s unclear how tiny experiences add up to one unified mind',
            'Experience may not be real: perhaps it only seems to us that we have experiences at all',
            'Strong emergence is coherent: novel features can arise that are not intelligible from the features of the base',
            'Physics may capture the intrinsic nature of matter after all, not just its relations'],
        why: 'This is the <b>combination problem</b> (a standard objection, outside the notes): it accepts the route to panpsychism and asks whether the result can work. The others deny realism, the rejection of strong emergence, or the structuralism premise.' },
      { q: 'Strawson calls eliminativism the strangest belief in history, yet suggests electrons may have experiential being. How can he consider his own view the more sensible one?',
        o: ['Eliminativism denies what we know for certain; panpsychism only says something about what we don’t know',
            'Panpsychism is supported by experiments in physics, while eliminativism has no evidence at all',
            'Eliminativism is a form of dualism, and dualism has already been refuted by Elisabeth',
            'Panpsychism is the majority view among scientists, while eliminativism is held by only a few'],
        why: 'We are certain that experience exists. Matter’s intrinsic nature is unknown, since physics is silent on it. So panpsychism contradicts nothing we know; eliminativism contradicts the one thing we are surest of.' }
    ],

    godfrey: [
      { q: 'Engineers build a system from novel synthetic materials that operates on the same principles as a living nervous system. What would Godfrey-Smith most likely say?',
        o: ['It could be a candidate for experience, because the principles of operation are what matter',
            'It cannot have experience, because it was made rather than evolved and is not alive',
            'It cannot have experience, because experience requires carbon-based neurons',
            'It must have experience, because anything functionally equivalent to a brain does'],
        why: 'Not artificiality but the principles of operation. Ruling it out for being made or for its material would be vitalism-like or carbon chauvinist. “Must” overstates his claim: working on the right principles makes it a candidate, not a guaranteed mind.' },
      { q: 'In Chalmers’ replacement argument, which premise does Godfrey-Smith deny, and which would a carbon chauvinist deny?',
        o: ['G-S: that functionally equivalent electronic neurons are possible; chauvinist: that experience can’t fade without a change in behaviour',
            'G-S: that experience can’t fade without a change in behaviour; chauvinist: that functionally equivalent electronic neurons are possible',
            'Both deny that functionally equivalent electronic neurons are possible, for the same reason',
            'Both accept every premise, and deny only that the conclusion follows from them'],
        why: 'Godfrey-Smith says electronics can’t be functionally equivalent to neurons, so the scenario never gets started. A carbon chauvinist can grant equivalence and still hold that, with the wrong material, experience fades — rejecting the claim that such fading is absurd.' },
      { q: 'A chatbot running on a digital computer gives reports of vivid experiences that seem sincere. How would Godfrey-Smith most likely assess it?',
        o: ['Its reports aren’t decisive: digital computers don’t work on the principles nervous systems do',
            'It must be conscious, since its behaviour is functionally equivalent to a person’s',
            'It can’t be conscious, since it is made of silicon rather than carbon',
            'It is conscious only if it passes a test in which expert judges can’t tell it apart from a person'],
        why: 'Behavioural similarity isn’t functional equivalence at the level that matters. The issue is how the system works, not what it says or what it is made of.' },
      { q: 'Godfrey-Smith has a functionalist view of life, yet denies that computers can be functionally equivalent to brains. Is this consistent?',
        o: ['Yes: if functions are fine-grained, matching inputs and outputs isn’t functional equivalence',
            'No: functionalism implies that any system with the right input–output profile is equivalent',
            'Yes, but only because he is a functionalist about life and a dualist about mind',
            'No: a functionalist must accept Chalmers’ conclusion, so he must give up his view of life'],
        why: 'Functional equivalence depends on the grain at which functions are individuated. If what matters is how neurons do what they do, a coarse input–output match is not enough.' },
      twoStatements('Which of the following statements are correct?',
        'Godfrey-Smith’s view entails that every living thing is conscious.',
        'Godfrey-Smith agrees with Strawson that fundamental particles lack experience.',
        3,
        'Neither. I: mind may arise out of living matter, especially nervous activity, but that doesn’t make every living thing conscious. II: Strawson is a panpsychist — he holds that experience <i>is</i> fundamental — so there is nothing here to agree with.'),
      { q: 'How might Godfrey-Smith answer Strawson’s claim that emergence of experience from non-experiential matter would be brute?',
        o: ['Life once seemed to need a special force yet came from organised activity; picturing matter as inert misleads',
            'Experience is present in all matter, so nothing needs to emerge — a view Strawson already shares',
            'Emergence is always brute, but brute facts are perfectly acceptable in science, so there is no problem here to answer',
            'Experience doesn’t exist, so there is nothing whose emergence needs explaining'],
        why: 'A natural line for the emergentist (a reading, not a quotation): vitalists thought life couldn’t come from non-living matter, yet it did through organised, metabolising activity. Focus on living activity, not inert particles, and emergence looks less like magic. The second option is panpsychism; the last is eliminativism.' }
    ],

    locke: [
      { q: 'Reid: a boy is flogged; as a brave officer he remembers the flogging; as an old general he remembers the officer’s deeds but not the flogging. What does Locke’s memory theory imply?',
        o: ['The general is the officer and the officer the boy, yet the general isn’t the boy — breaking transitivity',
            'The general is the boy, because he is psychologically continuous with him through the officer',
            'The officer is not the boy, because memories of being punished are unreliable',
            'None of them are the same person, because no one remembers every single earlier stage of their own life'],
        why: 'Direct memory relates general–officer and officer–boy but not general–boy. Identity is transitive, so the theory contradicts itself. The fix is overlapping chains (psychological continuity), which gives the second option — but that is the revised theory, not Locke’s.' },
      { q: 'Locke imagines the soul of a prince, with all his memories, entering the body of a cobbler. What does he say?',
        o: ['He is the same person as the prince, but the same man as the cobbler',
            'He is the same person and the same man as the cobbler',
            'He is the same person and the same man as the prince',
            'He is a new person altogether, since the memories and the body no longer match'],
        why: 'Person follows consciousness (memory); man follows the life of the organism. Locke separates the two, which is why the memory theory is neutral on the mind–body problem — and why Olson disagrees.' },
      { q: 'A replicant is implanted with memories copied from a real person’s experiences. What stops these counting as genuine memory links under the q-memory theory?',
        o: ['They weren’t carried forward by the reliable mechanism that preserves traces in one brain',
            'They are false, since the replicant never actually had the experiences that they are memories of',
            'They are q-memories, and q-memories never count as memory links of any kind',
            'They are too detailed to be real memories, since real memories fade over time'],
        why: 'The fix needs a chain of q-memories preserved by a reliable mechanism — reliable at the level of the brain. Implants are caused by the original experiences but by the wrong route. Saying “they’re false because the replicant never had the experiences” reintroduces identity, which is the circularity q-memory avoids.' },
      { q: 'One brain is scanned and its memories instantiated in two people. Why is this a problem for the memory theory?',
        o: ['Both meet the criterion but aren’t each other, so both can’t be the original; picking one is arbitrary',
            'Neither meets the criterion, because the memories were copied rather than remembered',
            'The scan destroys the original memories, so no memory link to the original person survives the process',
            'Both are the original, which the memory theory accepts, but common sense rejects'],
        why: 'Identity is one-one and transitive. If both remember being you, and you are each of them, they would be each other — absurd. Nothing favours one over the other. Parfit answers with a non-branching clause.' },
      twoStatements('Which of the following statements are correct?',
        'The identity of indiscernibles implies that qualitatively identical twins are one person.',
        'Leibniz’s law implies that if the adult has a property the child lacked, the adult is not the child — unless properties are indexed to times.',
        1,
        'II only. I is false: twins are not exactly alike in every respect (they are in different places, for one), so the principle doesn’t apply; and it says exactly-alike things are identical, not that similar things are. II is true: that is why diachronic identity seems to violate Leibniz’s law and needs an account of change.'),
      { q: 'Every plank of a ship is replaced one at a time. Over the same years every particle in an oak tree is replaced. What would Locke say?',
        o: ['The ship is not the same mass of matter after the first plank goes; the oak is the same oak',
            'Both are the same, because each change was gradual and the shape was kept throughout',
            'Neither is the same, since each lost all of the particles that composed it',
            'The ship is the same ship, but the oak is not the same oak, since trees lack memory'],
        why: 'Masses of matter can’t gain or lose a single atom, so the Ship of Theseus doesn’t survive. Living things persist while the same life goes on, whatever happens to their matter.' }
    ],

    olson: [
      { q: 'Which case is hardest for animalism to handle?',
        o: ['Your cerebrum goes into another head; the recipient has all your memories and character',
            'You were once a foetus without any psychological capacities at all',
            'You fall into a persistent vegetative state and never recover',
            'A teletransporter destroys your body and then builds an exact duplicate of it somewhere else'],
        why: 'Most people judge that you go with your cerebrum, but animalism says you stay with the animal. The other cases are where animalism does well: it says you were the foetus, you survive in a vegetative state, and the teletransporter kills you.' },
      { q: 'A constitution theorist accepts that there is a human animal in your chair and that it is thinking. What must they deny, and at what cost?',
        o: ['That you are the thinking thing in your chair — leaving two thinkers, and no way to tell which you are',
            'That the animal is really an animal — leaving no explanation of how you can be seen or touched',
            'That anything is thinking in your chair — leaving thought with no bearer at all',
            'That you exist at all — leaving only the animal, which is what Olson wanted anyway'],
        why: 'Granting P1 and P2 leaves P3 to deny. But then the animal thinks your thoughts and so do you — too many thinkers — and you couldn’t know whether you are the person or the animal.' },
      twoStatements('Which of the following does animalism imply?',
        'You were once a foetus.',
        'A person with severe dementia is the same individual who made a promise decades earlier.',
        2,
        'Both. You are the organism, and the organism was once a foetus; the organism with dementia is the very one that made the promise. Whether they still <i>owe</i> what was promised is a separate question (sample question 6).'),
      { q: 'Locke distinguished “same man” from “same person”. How does Olson’s view relate to this distinction?',
        o: ['You are the man (the animal), so “same life” fixes your persistence; “person” is a phase sortal',
            'You are the person, so memory gives your persistence conditions, and “man” is only a phase sortal',
            'Olson accepts both criteria, so you are two things — a man and a person',
            'Olson rejects both criteria, since neither memory nor life matters to identity'],
        why: 'Olson sides with Locke’s criterion for living things: you persist while the same life goes on. Being a person is a phase of the animal’s life, like being a teenager.' },
      { q: 'If “person” is a phase sortal like “child”, which follows?',
        o: ['You could stop being a person without ceasing to exist',
            'You could stop existing while still being a person',
            'You are a person at every moment of your existence',
            'You become a different animal when you become a person'],
        why: 'A child grows up without ceasing to exist. Likewise an animal can lose the capacities that make it a person (as in an irreversible coma) and still exist.' },
      { q: 'A teletransporter malfunctions and makes two copies at the destination. Why is this a problem for the memory theory but not for animalism?',
        o: ['Both copies qualify by memory, which identity can’t allow; animalism says you died and neither copy is you',
            'Neither copy has your memories, so the memory theory says you died; animalism says one copy is you',
            'Both theories say both copies are you, but only the memory theory has a problem with that',
            'Animalism says the copy that is more physically similar to your old body is you'],
        why: 'Identity is one-one, so two memory-continuous copies can’t both be you. Animalism has a clean answer: the organism was annihilated, so you died — a way to die, not to travel.' }
    ],

    dennett: [
      { q: 'Ismael says our self-representation does real work. Which analogy best captures her view?',
        o: ['The “you are here” marker on a ship’s chart, which the navigator steers by',
            'A centre of gravity, a useful abstraction that is not part of the object',
            'A character in a novel, who exists only in the stories told about them',
            'A shadow, which moves with the body but has no effect on it'],
        why: 'A self-steering system needs to represent itself, as a navigator needs to mark the ship’s position. The representation is constructed but used. The centre of gravity is Dennett’s analogy; a shadow is the epiphenomenal picture Ismael rejects.' },
      { q: 'A lobster will eat another lobster’s claw but not its own (Dennett’s example). Which notion of self does this illustrate?',
        o: ['The minimal self: an organisation that keeps itself distinct',
            'The narrative self: a story the lobster tells itself about its own life',
            'A Cartesian self: a soul that knows which body is its own',
            'A Lockean person: a being that remembers its own past'],
        why: 'Distinguishing self from world needs no language or memory — just boundary maintenance. That is the minimal, biological self.' },
      { q: 'Why does dissociative identity disorder count in favour of Dennett’s view rather than against it?',
        o: ['If selves are centres of narrative gravity, a brain spinning two narratives should have two',
            'It shows that the self is located in one brain region, which can be divided in two by damage',
            'It shows that selves are souls, since one body can be inhabited by more than one',
            'It shows that the narrative self is consciously composed, since patients invent their selves'],
        why: 'If the self were one inner thing, two selves in one body would be baffling. If it is an abstraction from narratives, multiple narratives predict multiple selves.' },
      twoStatements('Which of the following are true on Dennett’s view?',
        'A dog has a minimal self but not a narrative self.',
        'The narrative self is a story we deliberately and consciously compose about ourselves.',
        0,
        'I only. I: a dog maintains its boundaries (minimal self) but lacks language, so it lacks the narrative self. II is false: the narrative is not a conscious storytelling process — the stories largely spin us.'),
      { q: 'Sample question 5 asks: if our self-representations guide our actions, is it accurate to call the narrative self a fiction? Which distinction does most to answer it?',
        o: ['Fiction as a construction (which can be accurate and do work) vs fiction as an idle falsehood',
            'Fiction as something written down vs fiction as something that is only thought, inside someone’s head',
            'The minimal self vs the narrative self, since only the minimal self is biological',
            'Synchronic identity vs diachronic identity, since fictions exist only at a time'],
        why: 'A map is a construction but can be accurate and used to steer. If “fiction” means “constructed abstraction”, Dennett is right; if it means “false and idle”, Ismael’s point that self-representation guides action shows it isn’t a fiction.' },
      { q: 'Why do diachronic identity questions lose their force on Ismael’s view?',
        o: ['If the self is a steering model, what matters is that it keeps doing its job — not a further fact',
            'Because the self exists only at a single moment, so it cannot really persist through time at all',
            'Because the self is identical to the body, so its persistence is settled by biology',
            'Because the self is a soul, and souls persist automatically without any criterion'],
        why: 'If the self is a functioning representation in a self-governing system, “is it really the same self?” has no deep further answer. The notes also flag that she doesn’t discuss fission — a natural pressure point.' }
    ],

    parfit: [
      { q: 'A young idealist commits his future fortune to charity and tells his wife: “If I later change my mind, don’t let that later man revoke it.” Which Parfitian idea best explains his attitude?',
        o: ['Connectedness comes in degrees, so he can regard a weakly connected future self almost as another person',
            'Identity is non-branching continuity, so his later self is literally a different person from him now',
            'Identity doesn’t exist, so he owes nothing to his future self and can bind him freely',
            'His future self will lack his memories, so by the memory theory it will not be him'],
        why: 'Parfit uses this kind of case: identity holds (no branching), but connectedness weakens over a life, and attitudes can track that. The future man will still be him — so “literally a different person” is wrong.' },
      { q: 'On Parfit’s view, why might settling whether a dementia patient is the promise-maker fail to settle what they owe?',
        o: ['Obligations track what matters — connectedness and continuity, which come in degrees — not identity',
            'Identity can never be settled in such cases, so nothing about their obligations can ever be settled either',
            'The promise was made by the body, so only the body is bound by it, whatever the mind is like',
            'People with dementia are no longer persons at all, so they cannot have any obligations'],
        why: 'Identity is all-or-nothing; connectedness comes in degrees. If what matters for being bound by a promise is connectedness, the patient may be the same person yet only weakly bound. That is sample question 6’s second part.' },
      { q: 'If one of my brain hemispheres were transplanted and the other destroyed, the survivor would be me. Why does Parfit find it odd to say I die when both are transplanted?',
        o: ['My relation to each survivor is the same as before; only the extra branch differs, and that can’t matter',
            'Two survivors means twice as many memories, so I would be even more fully preserved than before',
            'Both survivors would be me, so I would not die at all, only end up in two places',
            'One hemisphere always dominates, so the survivor with it would really be me'],
        why: '“How could a double success be a failure?” Each survivor’s relation to me is intrinsically like the single-transplant case. Whether I survive would then hang on whether another branch exists — which shows identity isn’t what matters. Parfit doesn’t say both are me.' },
      twoStatements('Which of the following statements about Parfit are correct?',
        'Parfit holds that in fission the original person survives as both resulting people.',
        'Parfit holds that personal identity is a matter of degree.',
        3,
        'Neither. I: by the non-branching clause neither survivor is the original — but what matters is preserved. II: <i>connectedness</i> comes in degrees; identity stays all-or-nothing.'),
      { q: 'Compare a Parfitian and an animalist on a teletransporter that makes a single exact copy.',
        o: ['Parfit: what matters is preserved, as good as ordinary survival. Animalist: you die',
            'Parfit: you die, since the body is destroyed. Animalist: you survive in the copy',
            'Both say you die, since the copy is only qualitatively identical to you',
            'Both say you survive, since a single copy raises no branching problem'],
        why: 'For Parfit, psychological continuity and connectedness are what matter, and the copy has them. For Olson, the organism is annihilated: a way to die, not to travel.' },
      { q: 'At 80, Ana remembers nothing from age 10. At 40 she remembered being 20, and at 20 she remembered being 10. Which is true of Ana at 80 and at 10?',
        o: ['They are psychologically continuous but only weakly connected, if at all',
            'They are strongly connected but not psychologically continuous',
            'They are neither continuous nor connected, so not the same person',
            'They are continuous and strongly connected, since memory chains are transitive'],
        why: 'Continuity is overlapping chains (80→40→20→10). Connectedness is direct links, which have faded. This is how the revised theory handles Reid’s officer — and why Parfit stresses that connectedness weakens within a life.' }
    ]
  };

  /* ========================= extended response ============================
     sample: n  marks a question from the official sample-question handout,
     reproduced word for word. plan = [heading, [points]]; must = checklist. */

  var ESSAYS = {
    nagel: [
      { sample: 1,
        q: 'Nagel in “What is it like to be a bat?” and Jackson in “Epiphenomenal qualia” give arguments that are similar in some respects but arrive at different conclusions. What are the key similarities and differences? Which conclusion, if either, is better justified by the argument?',
        plan: [
          ['Thesis', ['Both argue that complete physical knowledge leaves out what experience is like. Nagel concludes that we cannot understand how physicalism could be true; Jackson that it is false. The arguments establish an epistemic gap, so Nagel’s more modest conclusion is better justified.']],
          ['Similarities', ['Both grant complete physical (physiological) knowledge for the sake of argument: perfect bat physiology; Mary’s complete knowledge of colour vision.', 'Both locate what is left out in the subjective character of experience (what it is like; qualia).', 'Both start from a case of knowledge or understanding — what we can know, conceive or learn.']],
          ['Differences', ['Nagel: what it is like is graspable only from a type of point of view; reduction works by abandoning points of view, so it can’t work here. Conclusion: physicalism is “a position we cannot understand” (the pre-Socratic and “matter is energy”).', 'Jackson: physicalism = all information is physical information. Mary learns new information, so physicalism is false. He then accepts epiphenomenal qualia.', 'Jackson distinguishes his argument from Nagel’s: it isn’t about imagining an alien point of view — Fred and Mary are human.']],
          ['Which is better justified?', ['Jackson needs the extra premise that whatever Mary learns is a new fact. Physicalists deny it: she gains an ability (Lewis, Nemirow) or a new perspective on an old fact (bridge-building; compare Lois learning Clark Kent is Superman).', 'Nagel needs no such premise: he infers only a limit on our understanding.', 'Jackson’s conclusion also carries costs: epiphenomenal qualia make it hard to see how Mary could know about her qualia at all.']],
          ['Conclusion', ['Both arguments show an epistemic gap. Only Nagel’s conclusion stays within what the argument shows; Jackson’s metaphysical conclusion depends on a contested premise.']]
        ],
        must: ['Stated both conclusions accurately (cannot understand vs false)', 'Identified at least two real similarities', 'Explained the role of points of view (Nagel) vs information (Jackson)', 'Identified Jackson’s hidden premise that all knowledge is of facts', 'Gave a reasoned verdict on which conclusion is better supported'] },
      { q: 'Explain what Nagel means by the subjective character of experience. Why does he think it makes the mind–body problem seem “hopeless”?',
        plan: [
          ['Thesis', ['Experience has a character that exists only for a point of view. Physical reduction works by moving away from points of view, so it can’t capture experience — which is why consciousness makes the problem seem hopeless.']],
          ['Subjective character', ['An organism has conscious states iff there is something it is like to be it — for it.', 'Subjective: graspable only from a particular point of view (by creatures with a certain physiology, mentality, perhaps culture).', 'Qualia: the subjective qualities of particular experiences — not presupposed to be non-physical.']],
          ['The bat', ['Mammal, so it has experience; echolocation is unlike any human sense.', 'Imagining webbed arms tells me what it would be like for me to behave like a bat, not for a bat.', 'We grasp bat pain better than echolocation: subjectivity comes in degrees of similarity of point of view.']],
          ['Why reduction fails', ['Reduction moves from appearance to objective description of the same phenomenon (heat, lightning).', 'For experience, abandoning the point of view abandons the phenomenon: “what’s left of what it is like to be X if you take away X’s point of view?”', '“What X is like is Y” differs from “water is H₂O”.']],
          ['Hopeless — or just not yet understood?', ['Nagel doesn’t conclude physicalism is false; we have no conception of how it could be true (the pre-Socratic and “matter is energy”).', 'Objection: perhaps the gap reflects our concepts, not reality (bridge-building). Nagel can accept this — it is compatible with his epistemic conclusion.']],
          ['Conclusion', ['“Hopeless” describes our current understanding, not the metaphysics: the subjective character blocks the only model of reduction we have.']]
        ],
        must: ['Defined “something it is like” and subjectivity as point-of-view dependence', 'Used the bat example correctly (imagination limits)', 'Explained how reduction normally works and why it fails here', 'Stated Nagel’s epistemic (not anti-physicalist) conclusion', 'Considered whether the problem is really hopeless'] },
      { q: 'Nagel says physicalism is “a position we cannot understand”. Explain what he means, and assess whether this is a more defensible position than claiming that physicalism is false.',
        plan: [
          ['Thesis', ['Nagel means that we lack the concepts to see how experience could be physical, not that it isn’t. This is more defensible than outright rejection because it claims only what the argument supports.']],
          ['What he means', ['We have no conception of how “what it is like” could be identical to anything objective.', 'Comparison: a pre-Socratic saying “matter is energy” — possibly true, but not understandable without the theory that makes sense of it.', '“It would be a mistake to conclude that physicalism must be false.”']],
          ['Why not stronger?', ['The argument shows a limit on objective description and on imagination. Getting from “we can’t understand how” to “it isn’t so” needs a further premise.', 'History of science: claims we couldn’t understand later became intelligible.']],
          ['The case for the stronger claim', ['Jackson: if complete physical information leaves something out, physicalism (all information is physical) is false.', 'Dualists (Chalmers): the best explanation of an epistemic gap is an ontological gap.']],
          ['Assessment', ['Jackson’s step depends on treating what Mary gains as a new fact; bridge-builders and the ability hypothesis deny this.', 'Nagel’s position is consistent with all three responses (dualism, illusionism, bridge-building). That is a strength (fewer commitments) and a weakness (it leaves the metaphysical question open).']],
          ['Conclusion', ['More defensible, because it is all the bat argument shows — though it leaves us waiting for the concepts that would make physicalism intelligible.']]
        ],
        must: ['Explained the meaning of “cannot understand” with the pre-Socratic analogy', 'Distinguished the epistemic from the metaphysical claim', 'Presented the case for “physicalism is false” (Jackson or dualism)', 'Showed what the stronger claim needs (an extra premise)', 'Reached a clear verdict'] }
    ],

    jackson: [
      { sample: 2,
        q: 'Jackson in “Epiphenomenal qualia” treats qualia as causally powerless. If Mary exclaims in surprise when she first sees red, what, on that view, causes her exclamation? Assess whether the answer can preserve both his knowledge argument and his account of qualia.',
        plan: [
          ['Thesis', ['On Jackson’s view, the brain process caused by the red stimulus causes both the exclamation and the red quale. That keeps epiphenomenalism consistent, but it undermines the knowledge argument: if the quale causes none of Mary’s judgements, it is hard to see how she comes to know it.']],
          ['The two commitments', ['Knowledge argument: Mary knows all the physical information; on release she learns something new; so physicalism is false.', 'Epiphenomenalism: qualia are caused by brain processes but have no physical effects. His replies: regular succession isn’t causation; qualia are by-products (polar bear’s heavy coat); behaviour is evidence of qualia through a common cause (newspapers).']],
          ['What causes the exclamation', ['Not the quale. The light from the tomato causes a brain process, which causes (a) the quale and (b) her surprise, her belief “so that’s what red is like”, and her words.', 'This is consistent: the exclamation is a co-effect of the quale.']],
          ['The problem', ['Her belief about red’s quality is caused by the brain process alone; she would have it even if the quale were absent. So the belief isn’t sensitive to the quale.', 'Knowledge seems to need a connection between the belief and what it is about. Without one, how does Mary <i>know</i> what red is like — the very knowledge the argument says she gains?', 'Worse, her saying she has learned something is no evidence that she has, by Jackson’s lights — except via the common cause.']],
          ['Possible replies', ['Common-cause reliability: the brain process reliably produces both, so the belief is reliably correct. But then any argument from her new belief rests on a link that would hold even in a world without qualia.', 'Acquaintance: she knows the quale by having it, not by being caused to believe. But having it must make some difference to her knowing — which looks like causation again.']],
          ['Conclusion', ['The answer preserves the account of qualia but strains the knowledge argument, which needs Mary’s new knowledge to be of the quale. (Jackson later abandoned the view, partly for reasons like this.)']]
        ],
        must: ['Stated the knowledge argument and epiphenomenalism accurately', 'Answered the question directly: the brain process causes the exclamation (and the quale)', 'Explained why this makes Mary’s knowledge of qualia puzzling', 'Considered at least one reply on Jackson’s behalf', 'Reached a verdict on whether both can be preserved'] },
      { q: 'Explain Jackson’s knowledge argument. What is the strongest physicalist response, and does it succeed?',
        plan: [
          ['Thesis', ['The knowledge argument shows that complete physical information doesn’t give you knowledge of what experience is like. The strongest reply — that Mary gains a new way of grasping an old fact — blocks the anti-physicalist conclusion, though it leaves a question about what that new way of grasping is.']],
          ['The argument', ['Physicalism (Jackson): all information is physical information.', 'Fred sees an extra colour; complete knowledge of his brain doesn’t tell us what it is like.', 'Mary knows all the physical information about colour vision, then sees red and learns something new. So not all information is physical: physicalism is false.']],
          ['Hidden assumption', ['All knowledge is knowledge of facts. If Mary gains knowledge without a new fact, the argument fails.']],
          ['Physicalist responses', ['Ability hypothesis: she gains know-how — to recognise, imagine, remember red.', 'Bridge-building: she learns an old fact in a new way, a new perspective on what she knew. Compare Lois learning that Clark Kent is Superman — no new man, a new way of thinking of him.', 'Dennett: if she really knew everything physical, she wouldn’t be surprised.']],
          ['Does it succeed?', ['Best: bridge-building — it grants that something real changes for Mary.', 'Dualist pushback: Lois’s two ways of thinking are fixed by two properties. If Mary’s new way of grasping red is fixed by how red looks, is that property physical? The gap reappears for modes of presentation.', 'Reply: the new perspective is itself a physical state (a new kind of concept realised in the brain).']],
          ['Conclusion', ['The bridge-building reply defeats the argument as stated — the inference from new knowledge to a new fact is invalid — but it owes an account of phenomenal concepts.']]
        ],
        must: ['Stated physicalism as Jackson defines it', 'Set out Mary (or Fred) as an argument with premises', 'Identified the assumption that all knowledge is of facts', 'Explained at least one physicalist reply in detail', 'Assessed the reply against a dualist rejoinder'] },
      { q: 'Jackson defends the view that qualia are epiphenomenal against three objections. Explain the objections and his replies. Is epiphenomenalism a price worth paying for qualia?',
        plan: [
          ['Thesis', ['Jackson’s replies show that epiphenomenalism is consistent, but not that it is credible. The cost — that qualia make no difference to anything we say or do — is high.']],
          ['Why he needs it', ['The knowledge argument gives non-physical qualia. With causal closure, if they caused physical events they would compete with physical causes (compare Kim). So they must be causally idle.']],
          ['Objection 1: obviously pain causes avoidance', ['Reply: regular succession isn’t causation. A brain process could cause both the pain and the avoidance.']],
          ['Objection 2: evolution', ['Qualia would not have been selected if they did nothing.', 'Reply: by-products. The polar bear’s coat was selected for warmth; its heaviness came with it. Qualia are by-products of selected brain processes.']],
          ['Objection 3: other minds', ['If qualia have no effects, behaviour can’t be evidence of them.', 'Reply: common cause. One newspaper’s report is evidence of another’s because both are caused by the same event. Behaviour is evidence of qualia because both come from the brain process.']],
          ['Is it worth it?', ['Our judgements about qualia (“this hurts”) would be produced in exactly the same way without them — so how do we know about them?', 'It cuts against the motivation: we believed in qualia because of how experience strikes us, but on this view it is not the qualia that strike us.', 'Alternative: Yablo-style or bridge-building views keep mental causation.']],
          ['Conclusion', ['Coherent but costly. Unless the knowledge argument is very strong, it is better to reject a premise than to accept that our experiences make no difference.']]
        ],
        must: ['Explained why Jackson needs epiphenomenalism', 'Stated all three objections', 'Gave Jackson’s reply to each (including polar bear and common cause)', 'Raised the knowledge or self-stultification problem', 'Gave a reasoned verdict on the cost'] },
      { q: 'Does Mary learn a new fact when she leaves the room? Defend an answer by comparing the dualist, bridge-building and illusionist responses.',
        plan: [
          ['Thesis', ['She doesn’t learn a new fact; she acquires a new way of grasping facts she already knew. The bridge-building response explains what changes for her without the costs of the other two.']],
          ['Dualist', ['Yes: an epistemic gap because there is an ontological gap (Jackson 1982, Chalmers). Mary learns a non-physical fact about qualia.', 'Cost: property dualism and, with causal closure, epiphenomenal qualia — which makes Mary’s knowledge mysterious.']],
          ['Illusionist / eliminativist', ['Consciousness is not what it seems (Dennett, Churchlands, Frankish). Mary’s sense that she discovers something new is part of the illusion.', 'Cost: denies what seems most certain. Strawson: “the strangest thing that has ever happened in the whole history of human thought”.']],
          ['Bridge-building', ['No ontological gap; reality is uniform but appears in different guises.', 'Mary gains a new perspective on an old fact — like Lois learning that Clark Kent is Superman: one man, two ways of grasping him.', 'Explains the change in Mary while keeping a uniform world.']],
          ['Objection and reply', ['Objection: a new way of grasping must be fixed by some property; if that property is how red looks, isn’t that a new fact about experience?', 'Reply: the property is physical; what is new is the concept, a brain state Mary couldn’t have formed without seeing colour.']],
          ['Conclusion', ['No new fact. The gap is a gap between kinds of concepts, not between kinds of reality.']]
        ],
        must: ['Explained all three responses accurately', 'Linked dualism to epiphenomenalism or its costs', 'Explained the bridge-building idea with an example', 'Raised and answered an objection to the chosen view', 'Gave a clear, defended answer'] }
    ],

    gap: [
      { q: 'Explain Levine’s explanatory gap. Does the existence of such a gap show that consciousness is not physical?',
        plan: [
          ['Thesis', ['There is a real explanatory gap: physical facts don’t make it intelligible why experience feels as it does. But an explanatory gap is epistemic; it shows consciousness isn’t physical only with an extra premise, which bridge-builders reject.']],
          ['The gap', ['You can learn everything about colour and still gain understanding on first seeing it.', 'Heat is molecular motion: heat is understood by its causal role; once we find what plays the role, nothing is left over.', 'Pain is C-fibre firing: even granting it plays pain’s role, why does it feel like <i>this</i>? Psychophysical identities would be unlike other scientific identities.']],
          ['Epistemic vs metaphysical', ['Nagel, Jackson and Levine give claims of epistemic limitation; the problem the lecture poses is metaphysical. Does the first settle the second?']],
          ['Yes: dualism', ['Best explanation of the epistemic gap is an ontological gap (Jackson 1982, Chalmers).']],
          ['No: bridge-building', ['One uniform reality, two ways of grasping it. The gap comes from our having phenomenal concepts as well as physical ones. Compare Clark Kent and Superman.', 'No: illusionism — the thing that seems unexplained isn’t there as it seems.']],
          ['Conclusion', ['The gap is real, but it shows something about our concepts. The inference to non-physicality needs the premise that conceptual gaps reflect gaps in reality — which is exactly what is in dispute.']]
        ],
        must: ['Explained the gap with the heat/pain contrast', 'Explained why causal-role concepts close the gap for heat', 'Distinguished epistemic from metaphysical claims', 'Presented the dualist inference and a physicalist response', 'Reached a clear verdict'] },
      { q: 'Compare dualism, eliminativism and bridge-building materialism as responses to the epistemic problem of consciousness. Which is most promising?',
        plan: [
          ['Thesis', ['All three accept that physical knowledge doesn’t yield knowledge of what experience is like. Bridge-building materialism is most promising because it explains that without denying experience or adding a second kind of reality.']],
          ['The problem', ['Nagel’s bat, Jackson’s Mary, Levine’s explanatory gap: complete physical knowledge seems to leave out what experience is like.']],
          ['Dualism', ['Epistemic gap because of an ontological gap (Jackson, Chalmers) — not Cartesian: non-physical properties.', 'Strength: takes the gap at face value. Weakness: mental causation (Kim’s exclusion, Elisabeth’s problem again) → epiphenomenalism.']],
          ['Eliminativism / illusionism', ['Consciousness is not what it seems (Dennett, Churchlands, Frankish).', 'Strength: keeps a simple physical world. Weakness: denies what seems most certain — Strawson’s “strangest thing in the history of human thought”.']],
          ['Bridge-building', ['No ontological gap; reality uniform, appears in different guises. Mary gains a new perspective, not a new fact.', 'Strength: keeps experience and keeps it causally efficacious. Weakness: must explain why phenomenal concepts can’t be derived from physical ones without the gap reappearing.']],
          ['Conclusion', ['Bridge-building best balances the costs, though it trades a metaphysical gap for an open question about concepts.']]
        ],
        must: ['Stated the epistemic problem with at least one example', 'Explained each of the three responses accurately', 'Gave a strength and a weakness for each', 'Linked dualism to mental causation or epiphenomenalism', 'Defended a clear ranking'] },
      { q: '“Physicalism about consciousness is not obvious.” Explain why, using the distinction between particular experiences and the property of being in a mental state. Can a physicalist answer the worry?',
        plan: [
          ['Thesis', ['Particular experiences are easy to locate in the physical world; the property of being in pain is not. A physicalist can answer with token identity plus a bridge-building account of phenomenal properties.']],
          ['The worry', ['A particular pain occurs in space and time — in this brain, now.', 'The property of being in pain doesn’t seem to be located anywhere or to be a physical property like mass or charge.', 'So token physicalism looks plausible, type physicalism not.']],
          ['Background', ['Davidson (Test 1): token identity without type identity — every mental event is physical, but mental properties aren’t physical properties.', 'Nagel and Levine: the property “what it is like” resists objective description.']],
          ['Physicalist answers', ['Token-only: accept that properties don’t reduce (non-reductive physicalism). But Kim’s exclusion argument then threatens mental causation.', 'Bridge-building: the property is physical; it just appears to us in a different guise through phenomenal concepts.', 'Strawson: “physical” defined by examples, so experiential properties can be physical properties — physics just doesn’t describe them.']],
          ['Assessment', ['Token-only views inherit Kim’s problem. Bridge-building and Strawson both answer the worry, at different costs (a story about concepts vs panpsychism).']],
          ['Conclusion', ['The worry is real but answerable — though each answer accepts a cost.']]
        ],
        must: ['Explained the token/property contrast with an example', 'Linked to token vs type identity', 'Gave at least one physicalist answer', 'Raised a problem for that answer (e.g. Kim)', 'Reached a verdict'] }
    ],

    strawson: [
      { sample: 3,
        q: 'Strawson objects to the idea that experience could emerge from wholly non-experiential matter. Godfrey-Smith looks to the organisation of living systems, particularly nervous systems, for a route to experience. Explain Strawson’s objection to emergence. Does Godfrey-Smith offer a plausible response?',
        plan: [
          ['Thesis', ['Strawson argues that real emergence must be intelligible, and experience from the wholly non-experiential could not be. Godfrey-Smith’s focus on living, nervous activity makes emergence more plausible but doesn’t fully meet the intelligibility demand.']],
          ['Strawson’s objection', ['Realistic physicalism: experience is real and physical. Physics is “functionalist in character” — structure and relations, not intrinsic nature (Russell, Eddington).', 'Layer cake: if the physical is fundamentally non-experiential, experience must emerge higher up.', 'Liquidity is weak emergence — intelligible from the behaviour of H₂O molecules. Experience from the non-experiential would be brute, strong emergence, which is incoherent.', 'So the experiential is fundamental: panpsychism.']],
          ['Godfrey-Smith', ['Emergence after all: the only minded things we know are living. Mind arises from living matter, especially nervous systems.', 'Not vitalism (no special force), not carbon chauvinism (material not key). Life is a cluster concept, understood functionally.', 'What matters is the principles of operation of nervous systems — which digital computers don’t share (his reply to Chalmers).']],
          ['Is it a plausible response?', ['For: the vitalism analogy — life once looked impossible to derive from non-living matter; it was explained by organised activity. Picturing matter as inert particles makes emergence look like magic; living activity looks different.', 'Against: life is a cluster of functions (metabolism, reproduction), so explaining it is explaining doings. Strawson’s point is that experience isn’t a doing; organisation, however rich, is still structure. The explanatory gap returns.', 'It also doesn’t say <i>why</i> nervous activity is experiential — it says where to look.']],
          ['Conclusion', ['Godfrey-Smith gives a plausible research programme and weakens the sense of magic, but doesn’t yet show that the emergence is intelligible in Strawson’s sense. As the lecturer put it, either answer is weird — and the world doesn’t care about our sense of weirdness.']]
        ],
        must: ['Explained intelligible (weak) vs brute (strong) emergence with liquidity', 'Explained why Strawson concludes panpsychism', 'Explained Godfrey-Smith’s view (living systems, not vitalism, not carbon chauvinism)', 'Assessed the response against the intelligibility demand', 'Reached a reasoned verdict'] },
      { q: 'Explain Strawson’s argument that physicalism, properly understood, entails panpsychism. Which premise is weakest?',
        plan: [
          ['Thesis', ['Given realism about experience and physicalism, Strawson argues experience must be part of matter’s fundamental nature. The weakest premise is that strong emergence is incoherent.']],
          ['The argument', ['P1 Experience is real.', 'P2 Every real concrete phenomenon is physical (“physical” defined by examples, not physics).', 'C1 Experience is physical.', 'P3 Physics describes structure, not intrinsic nature (Russell, Eddington): “functionalist in character”.', 'P4 If the fundamental physical were wholly non-experiential, experience would have to emerge.', 'P5 Experience can’t emerge from the wholly non-experiential (brute emergence is incoherent).', 'C2 So experientiality is fundamental — panpsychism.']],
          ['Assessing premises', ['P1: denied only by eliminativists — Strawson’s “strangest thing in history”.', 'P3: well supported — physics specifies relations and dispositions.', 'P5: the crux. Why must emergence be intelligible to us? Our failure to understand it may reflect our limits (Nagel).']],
          ['Objection to the conclusion', ['Combination problem: how do micro-experiences add up to one unified human experience? That may be as hard as emergence.']],
          ['Conclusion', ['P5 is weakest: it turns a limit on understanding into a limit on reality — the same move Nagel declined to make for physicalism. The lecturer also doubted rejecting strong emergence is the way to go.']]
        ],
        must: ['Set out the argument as premises and conclusion', 'Explained Strawson’s definition of “physical”', 'Explained the structural view of physics', 'Identified and argued for a weakest premise', 'Mentioned an objection to panpsychism itself'] },
      { q: 'Strawson claims that both opponents and proponents of physicalism misunderstand it. Explain his reasons, and assess whether his own definition of “physical” is acceptable.',
        plan: [
          ['Thesis', ['Strawson says both sides wrongly assume the physical is non-mental. His ostensive definition avoids begging the question, but it threatens to make physicalism uninformative.']],
          ['The shared mistake', ['Opponents (dualists) and proponents (reductivists, eliminativists) both contrast physical with mental. So physicalists try to explain experience away, and dualists conclude experience is non-physical.']],
          ['Strawson’s definition', ['Define “physical” by pointing at examples of physical things, not by current physics — we can’t presume physics captures everything about the physical.', 'Physics is functionalist in character and doesn’t capture experiential being; so physics is incomplete about the physical.', 'Russell and Eddington: physics knows only structure.']],
          ['Is it acceptable?', ['For: avoids defining physicalism by a physics we know is incomplete (Hempel’s dilemma — outside the notes).', 'Against: if “physical” just means “like these examples”, and experience counts, physicalism looks close to “everything real is real”. What does it rule out?', 'Reply: it rules out substance dualism and immaterial souls, and it has content via the anti-emergence argument.']],
          ['Conclusion', ['The definition is acceptable as a corrective, but its value depends on the further arguments (structure of physics; against emergence), not on the definition alone.']]
        ],
        must: ['Explained the alleged shared mistake', 'Explained the ostensive definition and why not physics', 'Explained the structural view of physics', 'Raised a worry that the definition makes physicalism trivial', 'Reached a verdict'] },
      { q: '“Either strong emergence or panpsychism: whatever we choose, the answer is weird.” Explain why the lecture arrives at this dilemma. Which horn should we take?',
        plan: [
          ['Thesis', ['If experience is real and physical, either it emerges brutely from non-experiential matter or it is present at the fundamental level. Both are strange; I defend the emergence horn, because the world needn’t match our sense of what is intelligible.']],
          ['Why the dilemma', ['Realism: experience is real. Physicalism: everything concrete is physical.', 'Layer cake: if fundamental physics is non-experiential, experience must emerge.', 'Liquidity-style weak emergence won’t do: nothing in a structural description makes experience intelligible. So strong emergence — or the fundamental is experiential (panpsychism).']],
          ['Panpsychism (Strawson)', ['Avoids brute emergence; fits the silence of physics about intrinsic nature.', 'Costs: the combination problem; experiential being everywhere is hard to believe.']],
          ['Strong emergence (Godfrey-Smith, the lecturer’s doubts)', ['Experience arises from living nervous systems working on particular principles.', 'Costs: brute or at least unexplained emergence — Kim (Test 1) finds strong emergence incoherent with causal closure.']],
          ['Choosing', ['Strawson’s case against emergence relies on intelligibility to us. “The world doesn’t care about our sense of weirdness.”', 'Emergence is at least localised where the evidence is (living, nervous systems). Panpsychism spreads the mystery everywhere and still faces combination.']],
          ['Conclusion', ['Take emergence, but be honest that it is not yet intelligible.']]
        ],
        must: ['Explained how the dilemma arises (realism, physicalism, layer cake)', 'Explained weak vs strong emergence', 'Gave costs for each horn', 'Used Strawson and Godfrey-Smith', 'Chose and defended a horn'] }
    ],

    godfrey: [
      { q: 'Explain Chalmers’ neuron-replacement argument and Godfrey-Smith’s response. Does Godfrey-Smith’s view rule out conscious AI?',
        plan: [
          ['Thesis', ['Chalmers argues that functional organisation suffices for experience. Godfrey-Smith denies that electronic neurons could be functionally equivalent to biological ones. This rules out conscious digital computers, but not conscious artificial systems in general.']],
          ['Chalmers', ['Replace neurons one by one with electronic parts that do the same job. Behaviour, including reports, can’t change.', 'If experience faded or changed, the subject would sincerely report no change while experience vanished — absurd. So experience is preserved: organisation, not material, matters.']],
          ['Godfrey-Smith', ['Rejects the premise: electronic neurons won’t be functionally equivalent to biological ones.', 'Not because we don’t understand neurons enough, but because electronics doesn’t operate on the principles needed to replicate them.', 'Brains differ from digital computers: neurons vs CPU, storage, etc.']],
          ['Does this rule out AI?', ['It rules out consciousness from a digital computer running a program, however good its behaviour.', 'Not artificiality but principles of operation: an artificial system working like a nervous system could be a candidate.', 'Not vitalism (no life force) and not carbon chauvinism (material not key).']],
          ['Assessment', ['Strength: explains why behavioural mimicry (chatbots) is weak evidence.', 'Weakness: needs an account of which principles matter, and why those, rather than coarser functions, are relevant to experience.']],
          ['Conclusion', ['It rules out conscious AI of the current, digital kind, not conscious artificial systems as such.']]
        ],
        must: ['Stated Chalmers’ argument and its conclusion correctly', 'Explained that Godfrey-Smith rejects the premise, and why', 'Distinguished artificiality from principles of operation', 'Answered whether AI is ruled out (digital vs artificial)', 'Evaluated the view'] },
      { q: 'Godfrey-Smith suggests that mind arises out of living matter. Explain this view and how it differs from vitalism and carbon chauvinism. Is it plausible?',
        plan: [
          ['Thesis', ['Godfrey-Smith’s view is that mind arises from the activity of living (especially nervous) systems. It avoids vitalism and carbon chauvinism by being about how living systems work, and it is plausible as an account of where experience is found.']],
          ['The view', ['Emergence after all: in our experience, living things are the only minded things.', 'Life is a cluster concept — metabolism, reproduction, self-maintenance — understood functionally.', 'Nervous systems working on particular principles are the route to experience.']],
          ['Not vitalism', ['Vitalism: a special force or energy in living things. Godfrey-Smith posits no such force; life is a cluster of activities.']],
          ['Not carbon chauvinism', ['Carbon chauvinism: the material matters. For Godfrey-Smith, the principles of operation matter, not the stuff or its artificiality.']],
          ['Plausibility', ['For: fits the evidence of where minds are found; explains why digital computers are doubtful candidates.', 'Against: Strawson — organised activity is still structure, and experience from structure is unintelligible. The AI challenge — if a machine ever had a mind, life wouldn’t be key.']],
          ['Conclusion', ['Plausible as a guide to where experience arises; less successful at explaining why living activity is experiential.']]
        ],
        must: ['Explained the view and the cluster concept of life', 'Distinguished it clearly from vitalism', 'Distinguished it clearly from carbon chauvinism', 'Raised at least one objection (Strawson or AI)', 'Reached a reasoned verdict'] },
      { q: 'If machines can have minds, then life is not the key to understanding mind and consciousness. Assess this claim in light of the readings.',
        plan: [
          ['Thesis', ['The conditional is true, but its antecedent is doubtful for digital machines: Godfrey-Smith gives reasons to think they don’t operate on the principles that matter. So life may still be the key.']],
          ['Why the conditional holds', ['If a non-living system had a mind, being alive couldn’t be necessary for mind.']],
          ['The case that machines can have minds', ['Functionalism (Test 1, Putnam): mental states are functional states, multiply realisable.', 'Chalmers’ replacement argument: functional organisation suffices for experience.']],
          ['Godfrey-Smith’s reply', ['Electronic parts can’t be functionally equivalent to neurons — different principles of operation.', 'Not artificiality: a machine that worked like a nervous system might qualify — but then the key would be life-like operation, not life as such.']],
          ['Complications', ['Searle (Test 1): programs alone don’t give understanding — brains cause minds through causal powers, a similar point about principles vs programs.', 'Strawson: if experience is fundamental, neither life nor computation is the key.']],
          ['Conclusion', ['Life, or life-like operation, remains the best key we have. Whether a machine could be conscious depends on whether it shares how living nervous systems work.']]
        ],
        must: ['Explained why the conditional is true', 'Presented the case for machine minds (functionalism or Chalmers)', 'Explained Godfrey-Smith’s reply', 'Connected to another reading (Searle or Strawson)', 'Reached a clear verdict'] }
    ],

    locke: [
      { sample: 4,
        q: 'Explain the charge of circularity against Locke’s memory theory of personal identity. How does the introduction of the concept of a reliably caused quasi-memory help address the objection?',
        plan: [
          ['Thesis', ['The memory theory defines identity using memory, but genuine memory already presupposes identity. Quasi-memory removes identity from the definition, and the reliable-cause condition separates real memory links from confabulation without reintroducing it.']],
          ['The memory theory', ['Locke: a person is a thinking thing that can consider itself as itself; consciousness is extended by memory.', 'A at t1 is the same person as B at t2 iff B remembers being A. Not determined by the body; neutral on the mind–body problem.', 'Broadened to psychological continuity to handle forgetting (overlapping chains).']],
          ['The circularity charge', ['What makes a memory real rather than confabulated? It must be of an experience the rememberer actually had.', 'So “B remembers A’s experience” includes “B is A”. Identity is used to define memory, which is used to define identity — circular.', 'And the brain reconstructs memories from traces that fade or are overwritten, so seeming memory alone won’t do.']],
          ['The fix', ['Quasi-memory: a state just like a memory, except we don’t require that the experience was one’s own (or that it is accurate).', 'Require a chain of q-memories caused by the past experiences through a reliable mechanism — reliable at the level of the brain, not infallible.', 'B is the same person as A iff B is linked to A by such a chain. No step mentions identity.']],
          ['Does it work?', ['Yes against circularity: a reliable causal chain replaces “was really mine”; implanted memories (Blade Runner 2049) fail the reliable-mechanism test.', 'But it exposes duplication: scan one brain into two people and both have reliably caused q-memories. Identity is one-one, so they can’t both be the original. A non-branching clause (Parfit) is needed.']],
          ['Conclusion', ['The q-memory theory answers the circularity charge — a rare case of a well-backed, down-to-earth philosophical theory — but must be supplemented to handle duplication.']]
        ],
        must: ['Stated Locke’s memory theory accurately', 'Explained precisely why genuine memory presupposes identity', 'Defined quasi-memory', 'Explained the role of the reliable-cause condition', 'Noted a remaining problem (duplication/fission)'] },
      { q: 'Explain Locke’s account of the identity of masses of matter, living things and persons. Why does he give different answers for each?',
        plan: [
          ['Thesis', ['Locke holds that identity conditions depend on the sort of thing in question. Matter, life and personhood are different sorts, so their persistence conditions differ — the basis of his memory theory.']],
          ['Background', ['Three substances: God, finite intelligences, bodies. Finite spirits and particles are individuated by their time and place of beginning — which doesn’t settle personal identity.', 'Sortals: the answer to “what is it?” fixes what changes it can survive.']],
          ['Masses of matter', ['Identity of the composing particles: a body can’t gain or lose a single atom. The Ship of Theseus doesn’t survive.']],
          ['Living things', ['Persist as long as the same life processes go on, through change of matter (an oak, a horse).']],
          ['Persons', ['A thinking intelligent being that can consider itself as itself. Identity extends as far as consciousness (memory) reaches back.', 'Prince and cobbler: same person as the prince, same man as the cobbler.']],
          ['Why the differences matter', ['Explains change without violating Leibniz’s law: the oak is the same oak though its matter differs.', 'Lets “person” come apart from “man” — which Olson rejects: you are the man (animal), and “person” is a phase sortal.']],
          ['Conclusion', ['Sort-relative identity is Locke’s key move. It makes the memory theory possible, and it is exactly what animalism challenges.']]
        ],
        must: ['Explained identity of masses of matter (no atom lost)', 'Explained identity of living things (same life)', 'Explained personal identity (consciousness/memory)', 'Explained why sort matters (sortals or prince/cobbler)', 'Connected to a later debate (Olson or Leibniz’s law)'] },
      { q: 'Distinguish the identity of indiscernibles from the indiscernibility of identicals. Why does diachronic identity seem to violate Leibniz’s law, and how can the problem be resolved?',
        plan: [
          ['Thesis', ['The two principles are converses and are often conflated. Diachronic identity seems to violate Leibniz’s law because things change; the fix is to treat properties as had at times.']],
          ['Identity', ['The relation everything has to itself and no other thing — numerical (Superman = Clark Kent), not qualitative (identical twins).']],
          ['The two principles', ['Identity of indiscernibles: there cannot be two things exactly alike; exactly alike → identical. Leibniz: a metaphysical necessity, with an appeal to God. Controversial — could there be two qualitatively identical spheres?', 'Indiscernibility of identicals (Leibniz’s law): identical → exactly alike. Almost universally accepted.']],
          ['Synchronic vs diachronic', ['Synchronic: what am I? — answered with a sortal.', 'Diachronic: is A at t1 the same as B at t2? I was short at five and am tall now. If I am that child, Leibniz’s law says we share every property — but we don’t.']],
          ['Resolution', ['Index properties to times: the one thing has the property short-at-5 and the property tall-at-30. The identical thing then has all the same time-indexed properties.', 'Then the real question becomes: what changes can a thing survive? — which needs a sortal (mass of matter, organism, person).']],
          ['Conclusion', ['Leibniz’s law survives once properties are indexed to times; the work shifts to sortal-relative persistence conditions, such as Locke’s.']]
        ],
        must: ['Defined numerical identity', 'Stated both principles and which is Leibniz’s law', 'Explained the synchronic/diachronic distinction', 'Explained why change seems to violate Leibniz’s law', 'Gave a resolution (time-indexing) and linked it to sortals'] },
      { q: 'One brain is scanned and its memories instantiated in two people. What problem does this pose for the memory theory of personal identity, and how should a memory theorist respond?',
        plan: [
          ['Thesis', ['Duplication shows that memory connections can branch while identity cannot. The best response is to add a non-branching condition — and, with Parfit, to accept that identity isn’t what matters.']],
          ['The theory', ['Locke: same person iff memory reaches back; refined to chains of reliably caused q-memories.']],
          ['The problem', ['Both duplicates q-remember your life by a reliable process (if the scan counts as reliable).', 'Identity is one-one and transitive: if each is you, they are each other — but they are two people.', 'Choosing one is arbitrary, since nothing distinguishes them.']],
          ['Responses', ['Deny that scanning is a reliable mechanism (only the brain’s normal process counts). But then the theory relies on brain continuity, moving towards a physical criterion.', 'Non-branching clause: identity = non-branching psychological continuity. Neither duplicate is you.', 'Parfit: what matters — connectedness and continuity — is preserved twice over. “How could a double success be a failure?”', 'Animalist alternative (Olson): you go with the organism; scanning doesn’t move you at all.']],
          ['Assessment', ['The non-branching clause makes identity depend on something extrinsic (whether there is another copy) — which suggests identity isn’t what matters.']],
          ['Conclusion', ['Add non-branching, and accept that identity is less important than we thought.']]
        ],
        must: ['Explained the memory/q-memory theory', 'Explained why duplication conflicts with the logic of identity', 'Gave at least two possible responses', 'Explained Parfit’s non-branching clause and his “what matters” move', 'Reached a verdict'] }
    ],

    olson: [
      { q: 'Explain Olson’s thinking animal argument. Which premise is most open to challenge, and how would Olson defend it?',
        plan: [
          ['Thesis', ['The thinking animal argument concludes that you are a human animal. Premise 3 — that you are the (only) thinking thing in your chair — is most open to challenge, but denying it creates the problem of too many thinkers.']],
          ['Animalism', ['You aren’t just related to a living organism; you are one. Persistence conditions are biological, not psychological.']],
          ['The argument', ['P1 There is a human animal sitting in your chair.', 'P2 The human animal in your chair is thinking.', 'P3 You are the thinking thing sitting in your chair.', 'C You are the human animal.']],
          ['Challenges', ['P1: denying it has implications that are too big.', 'P2: substance dualists may deny it — only an immaterial soul thinks. But that commits them to dualism.', 'P3: constitution theorists say you are a person constituted by the animal, like the statue and the lump of bronze — coincident but distinct.']],
          ['Olson’s defence of P3', ['If the animal thinks your thoughts and you are not the animal, there are two thinkers in your chair.', 'You couldn’t tell whether you are the person or the animal — the animal has the same evidence.', 'He denies the statue/lump model applies to you and the animal.']],
          ['Conclusion', ['P3 is the real battleground; Olson’s too-many-thinkers reply puts heavy pressure on constitution theories, though the transplant intuition remains an objection to animalism itself.']]
        ],
        must: ['Stated animalism', 'Set out the argument as premises and conclusion', 'Considered who denies each premise', 'Explained the constitution view (statue and lump)', 'Explained the too-many-thinkers reply'] },
      { q: 'Compare Olson’s animalism with Locke’s memory theory. Which gives the better account of what happens in teletransportation and in a cerebrum transplant?',
        plan: [
          ['Thesis', ['The two views give opposite verdicts in both cases. Animalism is better on teletransportation; the memory theory is better on cerebrum transplants. Which matters more depends on whether we trust the transplant intuition.']],
          ['Locke', ['Same person iff memory (or reliable q-memory chains) links you. Person can come apart from man (prince and cobbler).']],
          ['Olson', ['You are a human animal. Persistence is biological. “Person” is a phase sortal.']],
          ['Teletransportation', ['Memory theory: you travel — but if two copies are made, it can’t say which is you.', 'Animalism: the organism is annihilated, so it’s a way to die, not to travel. Clear and consistent.']],
          ['Cerebrum transplant', ['Memory theory: you go with your cerebrum — matches most people’s intuition.', 'Animalism: you stay with the animal; the recipient merely has your psychology. Counter-intuitive.', 'Olson’s reply: the intuition may track what we care about (psychology), not identity — a point Parfit develops.']],
          ['Assessment', ['Animalism has a principled answer everywhere (foetus, vegetative state, copies). The memory theory matches intuitions about transplants but needs a non-branching clause.']],
          ['Conclusion', ['Animalism better as a theory of identity; the memory theory better captures what we care about.']]
        ],
        must: ['Stated both theories accurately', 'Gave each view’s verdict on teletransportation (including two copies)', 'Gave each view’s verdict on cerebrum transplant', 'Weighed intuitions against theoretical consistency', 'Reached a reasoned verdict'] },
      { q: 'Olson claims that “person” is a phase sortal, like “child” or “teenager”. Explain the claim and assess its consequences for questions about personal identity.',
        plan: [
          ['Thesis', ['If “person” is a phase sortal, persistence questions are about the animal, not the person. That dissolves some puzzles but conflicts with the practical importance we attach to personhood.']],
          ['Sortals', ['Sortals divide things into sorts and tell us what changes a thing can survive.', 'Substance sortals (animal) give persistence conditions; phase sortals (child, teenager) apply for part of a thing’s life.']],
          ['Olson’s claim', ['Intelligence and reflection are capacities some animals have for some of their lives.', 'So you were once a non-person (a foetus) and could become one again (vegetative state) without ceasing to exist.']],
          ['Consequences', ['“Same person” questions become questions about the same animal.', 'Locke’s distinction between man and person collapses: you are the man.', 'The teletransporter kills you; the cerebrum recipient isn’t you.']],
          ['Assessment', ['For: avoids the too-many-thinkers problem and gives clear answers.', 'Against: much of our practical life (responsibility, promises, Locke’s “forensic” person) depends on psychology, not biology. Animalism may answer the identity question but not the questions we care about — a point Parfit develops.']],
          ['Conclusion', ['The phase-sortal claim is coherent and powerful for metaphysics, but it pushes the practical questions onto relations other than identity.']]
        ],
        must: ['Explained sortals, and substance vs phase sortals', 'Explained Olson’s claim with examples', 'Drew out consequences for at least two cases', 'Raised a practical or ethical objection', 'Reached a verdict'] }
    ],

    dennett: [
      { sample: 5,
        q: 'Dennett calls the self a “centre of narrative gravity”, while also describing a more basic biological form of selfhood. Explain how the two ideas relate to each other. If our self-representations guide our actions and relationships, is it accurate to call the narrative self a fiction?',
        plan: [
          ['Thesis', ['The narrative self is the human, language-based development of the biological self’s job of distinguishing and protecting an organism. If self-representations guide action, calling the narrative self a “fiction” is accurate only in Dennett’s sense of an abstraction — not in the sense of something idle or false.']],
          ['The minimal self', ['Living systems maintain their boundaries, so they are inherently self-like.', 'The minimal self: an organisation that tends to distinguish, control and preserve portions of the world — even a lobster that won’t eat its own claws. Needs no language.']],
          ['The narrative self', ['Human selfhood: self-protective strings of narrative (words). Not consciously composed — the stories largely spin us.', 'Like a centre of gravity: a useful abstraction, not a part of the brain. You won’t find it by walking around in a brain.', 'Consequences: depends on language; one brain can spin more than one (DID); little conscious control; arguably epiphenomenal.']],
          ['How they relate', ['Same function at two levels: the minimal self keeps the organism’s boundary; the narrative self protects and defines the person in words.', 'Our narratives are the human version of a spider’s web — a biological product doing self-protective work.']],
          ['Is it a fiction?', ['Ismael: a self-steering system needs to represent itself; our self-representation guides us through the world and represents us in our relations with others. So it is not epiphenomenal.', 'Two senses of “fiction”: a constructed abstraction (like a centre of gravity or a map) vs a falsehood with no role. The first is compatible with guiding action; the second isn’t.', 'Dennett’s own analogy helps: centres of gravity figure in real explanations (the truck tipped because its centre of gravity was high).']],
          ['Conclusion', ['The narrative self is constructed, but if it guides action it is not a mere fiction. Ismael keeps Dennett’s insight and drops the epiphenomenalism.']]
        ],
        must: ['Explained the minimal (biological) self', 'Explained the centre of narrative gravity and the analogy', 'Explained how the two relate (same function, different level)', 'Used Ismael’s objection about self-steering', 'Distinguished senses of “fiction” and gave a verdict'] },
      { q: 'Explain Dennett’s scepticism about the self. What are its consequences, and are they acceptable?',
        plan: [
          ['Thesis', ['Dennett denies there is a self as an inner thing, replacing it with a centre of narrative gravity. Its consequences — language-dependence, multiple selves, epiphenomenalism — are mostly acceptable, except the last.']],
          ['The scepticism', ['Dennett is a materialist. A self would have to be part or the whole of an animal; walking around a brain you won’t find one.', 'The minimal self: boundary maintenance. The human self: self-protective narrative, not consciously composed. The self is the centre of narrative gravity — an abstraction.']],
          ['Consequences', ['Depends on language: non-linguistic creatures lack a narrative self.', 'Contingent capacity of the brain: one brain can spin several (DID).', 'A fiction we have little conscious control over.', 'Epiphenomenal (the lecture’s word, not his).']],
          ['Assessment', ['Language-dependence: acceptable — animals keep minimal selves.', 'DID: a strength — predicts multiple selves.', 'Epiphenomenalism: Ismael’s objection — a self-steering system needs to represent itself; self-representation guides action and relationships.']],
          ['Conclusion', ['Accept the deflation of the self, reject its idleness: the self is a construction that works.']]
        ],
        must: ['Explained why Dennett denies an inner self', 'Explained the centre of narrative gravity', 'Listed at least three consequences', 'Assessed each consequence', 'Used Ismael against epiphenomenalism'] },
      { q: 'Ismael argues that Dennett “throws the baby out with the bathwater”. Explain her objection and assess what it implies for diachronic identity.',
        plan: [
          ['Thesis', ['Ismael keeps the idea that the self is constructed but insists the construction does work. If so, diachronic identity questions lose force: what matters is whether the self-model keeps steering, not a further fact.']],
          ['Dennett', ['Self as centre of narrative gravity: an abstraction spun from narrative, not consciously composed; arguably epiphenomenal.']],
          ['Ismael', ['A self-steering system needs to represent itself; our self-representation guides us through the world.', 'Social dimension: we construct selves to represent ourselves in our relations with each other.', 'So the self-representation is not epiphenomenal — the baby (a working self-model) was thrown out with the bathwater (an inner Cartesian self).']],
          ['Diachronic identity', ['If the self is a functioning model, “is it the same self?” has no deep further-fact answer; what matters is continuity of the model’s role.', 'This echoes Parfit: identity matters less than we think.', 'But the notes flag a gap: she doesn’t discuss fission. Two copies of one self-model would both steer — which is the self?']],
          ['Assessment', ['Persuasive against epiphenomenalism. Less complete as a theory of persistence.']],
          ['Conclusion', ['Ismael rescues the self’s causal role, at the cost of leaving the traditional identity questions unanswered rather than solved.']]
        ],
        must: ['Explained Dennett’s view briefly but accurately', 'Explained Ismael’s self-steering argument', 'Mentioned the social dimension', 'Explained why diachronic questions lose force', 'Noted the fission gap and gave a verdict'] },
      { q: 'Compare Dennett’s and Olson’s answers to the question “what am I?”. Can they both be right?',
        plan: [
          ['Thesis', ['Olson says you are a human animal; Dennett says the self is a centre of narrative gravity. They answer different questions, so both can be right: you are an animal, and your self is an abstraction the animal produces.']],
          ['Olson', ['Animalism: you are a human organism; “person” is a phase sortal. The thinking animal argument: the animal in your chair thinks, so you are it.']],
          ['Dennett', ['Materialist; a self would be part or whole of an animal, but you won’t find one.', 'Minimal self (boundary maintenance) and narrative self (self-protective stories) — an abstraction like a centre of gravity.']],
          ['Compatibility', ['Olson: what thing are you? An animal. Dennett: what is “the self”? An abstraction from narratives, not a thing.', 'Dennett agrees the self, if a thing, would be the animal; his minimal self is the organism’s self-maintenance. Olson’s animal is the system that spins Dennett’s narratives.']],
          ['Tension', ['Dennett allows multiple selves in one brain (DID); for Olson there is one animal, so one thinker. So Dennett’s “selves” can’t be what “I” refers to, on Olson’s view.', 'Ismael: if the self-model guides the animal, it is more than an idle abstraction — but still not a second thinker.']],
          ['Conclusion', ['Both can be right if “I” refers to the animal and “self” names its self-representation.']]
        ],
        must: ['Stated Olson’s answer accurately', 'Stated Dennett’s answer accurately', 'Identified the different questions they answer', 'Identified a genuine tension (e.g. DID)', 'Reached a verdict on compatibility'] }
    ],

    parfit: [
      { sample: 6,
        q: 'Someone who made a promise decades ago now has severe dementia and little psychological connection to their earlier life. How would Olson’s and Parfit’s views bear on whether this person is still the promise-maker? Does settling that question also settle what, if anything, they now owe?',
        plan: [
          ['Thesis', ['For Olson, the patient is the promise-maker (the same organism); for Parfit, the answer may be yes, unclear, or no, and it matters less. Either way, settling identity does not settle what they owe, because obligations track psychological relations that come in degrees.']],
          ['Olson', ['You are a human animal; persistence is biological. The organism with dementia is the organism that promised. So yes — the same individual.', '“Person” is a phase sortal: the animal may have partly stopped being a person, but it hasn’t stopped existing.']],
          ['Parfit', ['Identity = non-branching psychological continuity. Connectedness (direct links: episodic memory, intention carried into action) is now minimal.', 'If decline was gradual, overlapping chains may give continuity, so identity may hold; if chains broke, it may not. Either way identity isn’t what matters.', 'What matters is connectedness and continuity, which come in degrees.']],
          ['Does identity settle what they owe?', ['On Olson’s view: identity is settled (yes), but owing is not — a promise binds an agent able to understand and act on it, which depends on psychology the animal may have lost.', 'On Parfit’s view: obligations track what matters; with little connectedness, the patient is only weakly bound — like the idealist who wants his later self held to his commitments, connectedness weakens obligation.', 'Third parties (family, the promisee) may inherit duties to honour what the promise was for.']],
          ['Assessment', ['Separating identity from what matters fits our practice: we don’t hold dementia patients to old promises, though we accept they are the same human being.']],
          ['Conclusion', ['Olson settles identity; Parfit shows why that isn’t enough. What is owed depends on connectedness, not just on identity.']]
        ],
        must: ['Gave Olson’s verdict and reason (same organism)', 'Gave Parfit’s analysis using connectedness vs continuity', 'Explained non-branching identity or that identity isn’t what matters', 'Answered the second question: identity does not settle obligation', 'Reached a reasoned conclusion'] },
      { q: 'Explain Parfit’s argument from fission that identity is not what matters. Is it convincing?',
        plan: [
          ['Thesis', ['Fission shows that everything we care about in survival can be present without identity. The argument is convincing if we accept that the fission result is not as bad as death.']],
          ['Background', ['Parfit holds a Lockean view: connectedness (direct links), continuity (overlapping chains), identity = non-branching continuity.']],
          ['Fission', ['Each of my hemispheres is transplanted into a new body; both survivors are psychologically continuous with me.', 'With one transplant, the survivor would be me. With two, both can’t be me (they aren’t each other), and choosing one is arbitrary. So, with the non-branching clause, neither is me.', 'But each survivor relates to me exactly as the single survivor would. “How could a double success be a failure?”', 'So identity isn’t what matters; continuity and connectedness are.']],
          ['Objections', ['Perhaps fission really is as bad as death — the intuition is contested.', 'Animalist: neither survivor is the organism, so the case changes the subject.', 'Perhaps there were two people all along (overlapping before the split) — a rival way of saving identity.']],
          ['Assessment', ['The non-branching clause makes identity depend on an extrinsic fact (whether the other branch exists). That suggests identity can’t be what matters.']],
          ['Conclusion', ['Convincing: identity depends on something that can’t matter, so what matters must be something else.']]
        ],
        must: ['Defined connectedness, continuity and non-branching identity', 'Set out the fission case clearly', 'Explained why neither survivor is the original', 'Explained the inference to “identity isn’t what matters”', 'Considered an objection and reached a verdict'] },
      { q: 'Parfit’s motivation is ethical. Explain how his view of personal identity bears on self-interest and responsibility. Are these consequences plausible?',
        plan: [
          ['Thesis', ['If what matters is connectedness and continuity, which come in degrees, the special status of self-interest weakens and responsibility becomes partly a matter of degree. These consequences are plausible in moderation.']],
          ['The view', ['Identity seems to ground attitudes — regret, anticipation of pain, praise and blame. But that reliance is a contingent convenience, a conceptual shortcut.', 'Identity correlates in us with the relations that matter; connectedness weakens within a life.']],
          ['Self-interest', ['If my relation to my future self is indirect and a matter of degree, egoism should have less hold on me.', 'The gap between caring for my distant future self and caring for others narrows.']],
          ['Responsibility', ['If the self is a construction, we are at least partly responsible for it.', 'With weaker connectedness, desert and commitment weaken: an old criminal now unconnected to the crime; promises made by a much earlier self.']],
          ['Plausibility', ['For: matches how we treat dementia, and how attitudes fade as people change.', 'Against: makes commitments fragile; one could escape obligations by changing. Reply: weakened connectedness reduces, not removes, responsibility — and people can’t choose their connectedness at will.']],
          ['Conclusion', ['Plausible as a moderating influence on egoism and desert, not as permission to ignore one’s past.']]
        ],
        must: ['Explained why we care about identity, for Parfit', 'Explained the degree-based relations (connectedness)', 'Explained the consequence for self-interest/egoism', 'Explained the consequence for responsibility or promises', 'Evaluated plausibility with an objection'] },
      { q: 'Distinguish psychological connectedness from psychological continuity. Why does the distinction matter for Locke’s memory theory and for Parfit’s ethics?',
        plan: [
          ['Thesis', ['Connectedness is direct links; continuity is overlapping chains of them. The distinction saves the memory theory from the problem of forgetting and gives Parfit his ethical point that what matters comes in degrees.']],
          ['Definitions', ['Connectedness: direct links — episodic memory, intentional control (intending now, acting later), persisting beliefs and desires. Comes in degrees.', 'Continuity: overlapping chains of strong connectedness. Identity = non-branching continuity.']],
          ['For Locke’s theory', ['Forgetting: I don’t remember being two. On direct memory alone, I wouldn’t be that child.', 'Reid’s officer: the general remembers the officer, the officer the boy, but the general not the boy — direct memory breaks transitivity.', 'Continuity fixes both: overlapping chains link the general to the boy.']],
          ['For Parfit’s ethics', ['Identity (via continuity) is all-or-nothing; connectedness weakens within a life.', 'If what matters includes connectedness, our concern for our distant future and our responsibility for the distant past should weaken.', 'Self-interest and egoism lose some hold; obligations made by a weakly connected earlier self are weaker.']],
          ['Assessment', ['The distinction does real work: continuity for identity, connectedness for what matters. Objection: perhaps continuity alone matters, and Parfit’s ethics overreaches.']],
          ['Conclusion', ['Two relations, two jobs — and the gap between them is where Parfit’s ethical conclusions come from.']]
        ],
        must: ['Defined both relations accurately', 'Explained how continuity answers forgetting or Reid', 'Explained identity as non-branching continuity', 'Explained the ethical role of degrees of connectedness', 'Evaluated the distinction'] }
    ]
  };

  /* ============================== builders ==============================
     Templates, the builder and the mock test come from arts3367-kit.js. */

  var KIT = global.ARTS3367Kit.make({
    GUIDES: GUIDES, TOPICS: TOPICS, MCQ: MCQ, HARD: HARD, ESSAYS: ESSAYS,
    testName: 'In-class Test 2', scopeLabel: 'Consciousness & personal identity'
  });

  /* ============================ drill + reference ============================ */

  var TERMS = [
    { tag: 'Consciousness · Nagel', q: 'Phenomenal consciousness', a: 'The subjective quality of mental life — what an experience is like for its subject. Not wakefulness (vs knocked out), not access to repressed desires.' },
    { tag: 'Consciousness · Nagel', q: 'Qualia', a: 'The subjective qualities of particular experiences (the hurtfulness of pain). Using the word doesn’t presuppose they are non-physical.' },
    { tag: 'Consciousness · Nagel', q: 'Nagel’s criterion of consciousness', a: 'An organism has conscious states iff there is something it is like to be that organism — something it is like for it.' },
    { tag: 'Consciousness · Nagel', q: 'Subjective (Nagel)', a: 'A concept or description is subjective to the extent it is graspable only from a particular point of view — by creatures with a certain physiology, mentality, perhaps culture.' },
    { tag: 'Consciousness · Nagel', q: 'Reductive explanation', a: 'Moving from how a phenomenon appears to us to a more objective description of the same phenomenon (heat → molecular motion). Fails for experience: leaving the point of view leaves the phenomenon.' },
    { tag: 'Consciousness · Nagel', q: 'Nagel on physicalism', a: '“A position we cannot understand because we do not at present have any conception of how it might be true” — like “matter is energy” said by a pre-Socratic. Not false.' },
    { tag: 'Consciousness · Jackson', q: 'Physicalism (Jackson)', a: 'All information about the world is physical information — physics, chemistry, neurophysiology, plus causal and functional facts.' },
    { tag: 'Consciousness · Jackson', q: 'The knowledge argument', a: 'Mary knows all the physical information about colour vision; on seeing red she learns something new; so physical information isn’t all the information — physicalism is false. (Fred: an extra colour.)' },
    { tag: 'Consciousness · Jackson', q: 'The hidden assumption', a: 'All knowledge is knowledge of facts. If Mary gains knowledge without a new fact (an ability; a new way of grasping an old fact), the argument fails.' },
    { tag: 'Consciousness · Jackson', q: 'Epiphenomenalism', a: 'Qualia are caused by brain processes but have no physical effects.' },
    { tag: 'Consciousness · Jackson', q: 'Jackson’s three replies', a: '(1) Regular succession isn’t causation — a brain process causes both pain and wince. (2) Qualia are by-products, like a polar bear coat’s heaviness. (3) Behaviour is evidence of qualia via a common cause (two newspapers).' },
    { tag: 'Consciousness · Explanatory gap', q: 'Explanatory gap (Levine)', a: '“Heat is molecular motion” leaves nothing to explain (heat = what plays heat’s causal role). “Pain is C-fibre firing” does: why does that feel like this? Epistemic, not (by itself) metaphysical.' },
    { tag: 'Consciousness · Explanatory gap', q: 'Three responses', a: '1. Dualism (not Cartesian): epistemic gap because ontological gap — Jackson, Chalmers. 2a. Eliminativism/illusionism: consciousness isn’t what it seems — Dennett, Churchlands, Frankish. 2b. Bridge-building materialism: no ontological gap.' },
    { tag: 'Consciousness · Explanatory gap', q: 'Bridge-building materialism', a: 'Reality is uniform but can appear in different guises. Mary learns no new fact; she gains a new perspective on something she already knew (cf. Lois learning Clark Kent is Superman).' },
    { tag: 'Consciousness · Explanatory gap', q: 'Ability hypothesis (outside notes)', a: 'Lewis, Nemirow: Mary gains know-how — to recognise, imagine and remember red — not knowledge of a new fact.' },
    { tag: 'Consciousness · Strawson', q: 'Realistic physicalism', a: 'Experience is real (realism), and every real concrete phenomenon is physical. So experience is physical. “Physical” is defined by examples, not by current physics.' },
    { tag: 'Consciousness · Strawson', q: 'Physics is “functionalist in character”', a: 'It describes how things relate to and affect each other (including our senses and instruments), not the intrinsic nature of matter. Russell; Eddington.' },
    { tag: 'Consciousness · Strawson', q: 'Weak vs strong (brute) emergence', a: 'Weak: intelligible from the base — liquidity from H₂O behaviour. Strong/brute: not intelligible — experience from the wholly non-experiential. Strawson: incoherent.' },
    { tag: 'Consciousness · Strawson', q: 'Panpsychism', a: 'Experientiality is a fundamental feature of matter, like mass or charge, possibly everywhere. Strawson: real physicalism entails it.' },
    { tag: 'Consciousness · Strawson', q: 'The lecture’s dilemma', a: 'Physicalist or not, the answer is weird: strong emergence or panpsychism. “The world doesn’t care about our sense of weirdness.”' },
    { tag: 'Consciousness · Godfrey-Smith', q: 'Godfrey-Smith’s view', a: 'Emergence after all: mind arises out of living matter (nervous systems). Not vitalism, not carbon chauvinism. Principles of operation matter.' },
    { tag: 'Consciousness · Godfrey-Smith', q: 'Carbon chauvinism vs vitalism', a: 'Carbon chauvinism: the material (carbon vs silicon) matters. Vitalism: living things have a special force or energy. Godfrey-Smith rejects both.' },
    { tag: 'Consciousness · Godfrey-Smith', q: 'Life as a cluster concept', a: 'Things that metabolise, reproduce, maintain themselves… — a functionalist view of life, no single necessary feature.' },
    { tag: 'Consciousness · Godfrey-Smith', q: 'Chalmers’ neuron replacement', a: 'Replace neurons one by one with functionally equivalent electronics; behaviour can’t change; experience fading unnoticed is absurd; so experience is preserved. G-S: rejects the premise — electronics can’t be functionally equivalent, since it runs on different principles.' },
    { tag: 'Personal identity · Locke', q: 'Identity (numerical)', a: 'The relation everything has to itself and to no other thing (Superman = Clark Kent). Not qualitative similarity (identical twins).' },
    { tag: 'Personal identity · Locke', q: 'Identity of indiscernibles vs Leibniz’s law', a: 'Identity of indiscernibles: exactly alike → identical (Leibniz: necessary, via God). Indiscernibility of identicals (Leibniz’s law): identical → exactly alike. Often conflated.' },
    { tag: 'Personal identity · Locke', q: 'Synchronic vs diachronic', a: 'Synchronic (at a time): what am I? — answered with a sortal. Diachronic (across time): same thing at t1 and t2? Seems to violate Leibniz’s law; involves change.' },
    { tag: 'Personal identity · Locke', q: 'Locke: matter, life, persons', a: 'Masses of matter: same particles — can’t lose an atom (Ship of Theseus fails). Living things: same life. Persons: consciousness extended by memory.' },
    { tag: 'Personal identity · Locke', q: 'Memory theory', a: 'A at t1 is the same person as B at t2 iff B remembers being A. Not determined by the body; neutral on the mind–body problem. Broadened to psychological continuity.' },
    { tag: 'Personal identity · Locke', q: 'Circularity objection', a: 'Genuine (not confabulated) memory must be of one’s own past, so defining identity by memory presupposes identity.' },
    { tag: 'Personal identity · Locke', q: 'Quasi-memory (q-memory)', a: 'A state just like a memory, without requiring that the experience was one’s own. Identity = chain of q-memories preserved by a reliable (not infallible) mechanism.' },
    { tag: 'Personal identity · Olson', q: 'Animalism', a: 'You are a human animal — not related to one, you are one. Biological, non-psychological persistence. Teletransporter = a way to die.' },
    { tag: 'Personal identity · Olson', q: 'Thinking animal argument', a: '(1) A human animal is in your chair. (2) It is thinking. (3) You are the thinking thing in your chair. (C) So you are the human animal.' },
    { tag: 'Personal identity · Olson', q: 'Constitution view', a: 'Like a statue and its lump of bronze: coincident but distinct. Olson denies this applies to you and the animal (too many thinkers).' },
    { tag: 'Personal identity · Olson', q: 'Phase sortal', a: 'Like “child” or “teenager”: applies for part of a thing’s existence. For Olson, “person” is one — capacities some animals have for some of their lives.' },
    { tag: 'Personal identity · Dennett', q: 'Minimal self', a: 'An organisation that tends to distinguish, control and preserve portions of the world. Living systems maintain their boundaries. Could apply to machines or countries.' },
    { tag: 'Personal identity · Dennett', q: 'Centre of narrative gravity', a: 'The human self: an abstraction (like a centre of gravity) produced by self-protective strings of narrative, not consciously composed. Language-dependent; can be multiple (DID); arguably epiphenomenal.' },
    { tag: 'Personal identity · Ismael', q: 'Ismael’s reply to Dennett', a: 'He throws the baby out with the bathwater: a self-steering system needs to represent itself; self-representation guides us and represents us in our relations with others. Not epiphenomenal.' },
    { tag: 'Personal identity · Parfit', q: 'Fission', a: 'An event that causes two copies of someone’s psychology to be instantiated elsewhere. Neither is identical to the original, yet nothing that matters is lost.' },
    { tag: 'Personal identity · Parfit', q: 'Connectedness vs continuity', a: 'Connectedness: direct links (episodic memory, intentional control). Continuity: overlapping chains of connectedness.' },
    { tag: 'Personal identity · Parfit', q: 'Identity (Parfit)', a: 'Non-branching psychological continuity. All-or-nothing — while connectedness comes in degrees.' },
    { tag: 'Personal identity · Parfit', q: 'Why identity matters less', a: 'It seems to ground regret, anticipation, praise — but that is a contingent convenience. What matters is connectedness/continuity. Ethical upshot: less egoism; responsibility for the self we construct.' }
  ];

  var WHO = [
    { tag: 'Who argues what', q: 'Nagel', a: 'What is it like to be a bat? Experience is subjective — tied to a point of view — so reduction fails; physicalism is a position we cannot (yet) understand.' },
    { tag: 'Who argues what', q: 'Jackson (1982)', a: 'Knowledge argument (Fred, Mary): physicalism is false. Qualia are epiphenomenal. (Later became a physicalist.)' },
    { tag: 'Who argues what', q: 'Levine', a: 'The explanatory gap: psychophysical identities, unlike heat = molecular motion, leave something unexplained.' },
    { tag: 'Who argues what', q: 'Chalmers', a: 'Dualist response to the gap; neuron-replacement argument that functional organisation suffices for experience.' },
    { tag: 'Who argues what', q: 'Dennett, the Churchlands, Frankish', a: 'Eliminativism/illusionism: consciousness is not what it seems.' },
    { tag: 'Who argues what', q: 'Strawson', a: 'Realistic physicalism: experience is real and physical; physics gives only structure; experience can’t emerge from the non-experiential; so panpsychism.' },
    { tag: 'Who argues what', q: 'Russell and Eddington', a: 'Strawson’s authorities: physics is mathematical because we know so little; it describes structure, not intrinsic nature.' },
    { tag: 'Who argues what', q: 'Godfrey-Smith', a: 'Mind arises from living matter; life is a cluster concept; electronics can’t be functionally equivalent to neurons — principles of operation, not artificiality.' },
    { tag: 'Who argues what', q: 'Leibniz', a: 'Identity of indiscernibles (no two things exactly alike); Leibniz’s law (identicals are exactly alike).' },
    { tag: 'Who argues what', q: 'Locke', a: 'Identity is sort-relative: matter (same particles), living things (same life), persons (consciousness extended by memory). Prince and cobbler.' },
    { tag: 'Who argues what', q: 'Olson', a: 'Animalism: you are a human animal. Thinking animal argument. “Person” is a phase sortal.' },
    { tag: 'Who argues what', q: 'Dennett (on the self)', a: 'No inner self; minimal biological self; the human self is a centre of narrative gravity — a fiction, arguably epiphenomenal.' },
    { tag: 'Who argues what', q: 'Ismael', a: 'Self-representation is needed by a self-steering system, so it isn’t epiphenomenal; the self has a social dimension.' },
    { tag: 'Who argues what', q: 'Parfit', a: 'Fission: identity (non-branching continuity) isn’t what matters; connectedness and continuity are. Ethical upshot: less egoism.' }
  ];

  var SUBJECT = {
    id: 'arts3367-t2',
    code: 'ARTS3367',
    name: 'Philosophy of Mind — Test 2',
    tagline: 'In-class Test 2 (consciousness and personal identity): ' + KIT.counts.mc + ' core and ' + KIT.counts.hard + ' hard multiple-choice questions, and ' + KIT.counts.essay +
      ' extended-response questions (' + KIT.counts.sample + ' from the sample handout), each with a dot-point model answer. Use the Format chips to practise just one section.',
    templates: KIT.templates,
    build: KIT.build,
    labels: { guide: 'Topic primer', guideOpen: 'Hide primer', same: 'Another on this topic' },

    mockTest: {
      minutes: 45,
      blurb: 'Same shape as the real in-class test: <b>Section A</b>, ten multiple-choice questions across consciousness and personal identity, about 60% from the hard bank (1 mark each); <b>Section B</b>, one mini-essay of up to 500 words, chosen from three (10 marks here). Feedback is hidden until you submit; the essay is then self-assessed against the dot-point model answer. Set the time limit to match your real test.',
      build: KIT.buildMock
    },

    drillBlurb: 'Key terms and who argues what: consciousness and personal identity.',
    drillSets: [
      { id: 'terms', label: 'Key terms', cards: TERMS },
      { id: 'who', label: 'Who argues what', cards: WHO }
    ],

    reference: {
      title: 'ARTS3367 Test 2 reference',
      blurb: 'Who argues what, gaps in the notes filled in, and how the essay is marked.',
      fromDrill: 'terms',
      sections: [
        { heading: 'Who argues what', rows: WHO.map(function (c) { return [c.q, c.a]; }) },
        { heading: 'Gaps in your notes, filled in', rows: [
          ['Chalmers’ neuron replacement — which way round?',
           'Your notes say experience “would not be the same”. Chalmers’ own conclusion is the opposite: replace neurons one by one with functionally equivalent electronic parts and experience stays the same, since it would be absurd for it to fade while the subject sincerely reports no change. Godfrey-Smith grants the logic and rejects the premise that electronic parts could be functionally equivalent.'],
          ['Eddington (missed in lecture)',
           'Strawson cites Eddington alongside Russell: physics tells us about the structure of matter — how it behaves and relates — not its intrinsic nature, which leaves open that matter is intrinsically experiential.'],
          ['What Jackson says about qualia and evolution',
           'The polar bear’s thick coat is selected for warmth; it is heavy as a by-product. Qualia are like the heaviness — by-products of brain processes that do aid survival. For other minds: one newspaper’s report is evidence of another’s because both report the same event; behaviour is evidence of qualia because both come from the same brain process.'],
          ['Where q-memory comes from',
           'Quasi-memory was introduced by Sydney Shoemaker and taken up by Parfit, to avoid the circularity objection (associated with Joseph Butler: consciousness of identity presupposes identity).'],
          ['Reid’s brave officer (not in the notes, but standard)',
           'The general remembers the officer, the officer remembers the boy, the general doesn’t remember the boy. On direct memory, the general is the officer and the officer is the boy but the general isn’t the boy — breaking transitivity. Overlapping chains (psychological continuity) fix it.'],
          ['Locke’s prince and cobbler',
           'The prince’s consciousness enters the cobbler’s body: same <i>person</i> as the prince, same <i>man</i> as the cobbler. It shows Locke’s separation of person from man — which Olson rejects.'],
          ['Jackson’s later view',
           'Jackson later abandoned the knowledge argument and became a physicalist. In the test, discuss the 1982 paper’s position, but this is worth a sentence if you argue against it.']
        ] },
        { heading: 'Key contrasts', rows: [
          ['Nagel vs Jackson', 'Nagel: we can’t <i>understand</i> how physicalism could be true. Jackson: physicalism is <i>false</i>.'],
          ['Strawson vs Godfrey-Smith', 'Strawson: experience can’t emerge, so panpsychism. Godfrey-Smith: emergence after all, from living nervous systems.'],
          ['Locke vs Olson', 'Locke: you are a person; persistence is psychological. Olson: you are an animal; persistence is biological.'],
          ['Dennett vs Ismael', 'Dennett: the narrative self is a fiction (arguably epiphenomenal). Ismael: self-representation steers us, so it does work.'],
          ['Locke vs Parfit', 'Both psychological. Parfit adds non-branching, and says identity isn’t what matters.']
        ] },
        { heading: 'Writing the 500-word answer', rows: [
          ['Format', 'Coherent prose, not bullet points. The dot points here are for learning and planning only.'],
          ['Choose well', 'You pick 1 of 3. Choose the one where you can both explain the views and evaluate them.'],
          ['Use the sub-questions', 'Every sample question has two or three parts (“Explain… Does… Assess…”). Give each one its own paragraph so none is missed.'],
          ['Shape', 'Thesis (≈50 words) · explain the view or argument (≈150) · objection or complication (≈150) · response and verdict (≈150).'],
          ['Concrete cases', 'The bat, Mary, Fred, the polar bear, Clark Kent, liquidity, neuron replacement, the Ship of Theseus, the prince and cobbler, the teletransporter, fission, the dementia patient.'],
          ['Precise distinctions', 'Epistemic vs metaphysical · weak vs strong emergence · knowing a fact vs a new way of grasping it · numerical vs qualitative identity · connectedness vs continuity · substance vs phase sortal.']
        ] }
      ]
    }
  };

  if (global.Subjects) global.Subjects.register(SUBJECT);
  global.ARTS3367_T2_SUBJECT = SUBJECT;
})(typeof window !== 'undefined' ? window : globalThis);
