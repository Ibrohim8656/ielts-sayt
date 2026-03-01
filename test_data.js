// test_data.js
// Barcha o'qish (Reading) testlarini saqlovchi ma'lumotlar ombori
const TEST_DATA = {
    "activities_for_children": {
        title: "Activities for Children",
        source: "mini-ielts",
        passage: `
            <h2>Activities for Children</h2>
            <p><strong>A</strong> Twenty-five years ago, children in London walked to school and played in parks and playing fields after school and at the weekend. Today they are usually driven to school by parents anxious about safety and spend hours glued to television screens or computer games. Meanwhile, community playing fields are being sold off to property developers at an alarming rate. ‘This change in lifestyle has, sadly, meant greater restrictions on children,’ says Neil Armstrong, Professor of Health and Exercise Sciences at the University of Exeter. ‘If children continue to be this inactive, they’ll be storing up big problems for the future.’</p>
            <p><strong>B</strong> In 1985, Professor Armstrong headed a five-year research project into children’s fitness. The results, published in 1990, were alarming. The survey, which monitored 700 11-16-year-olds, found that 48 per cent of girls and 41 per cent of boys already exceeded safe cholesterol levels set for children by the American Heart Foundation. Armstrong adds, “heart is a muscle and need exercise, or it loses its strength.” It also found that 13 per cent of boys and 10 per cent of girls were overweight. More disturbingly, the survey found that over a four-day period, half the girls and one-third of the boys did less exercise than the equivalent of a brisk 10-minute walk. High levels of cholesterol, excess body fat and inactivity are believed to increase the risk of coronary heart disease.</p>
            <p><strong>C</strong> Physical education is under pressure in the UK – most schools devote little more than 100 minutes a week to it in curriculum time, which is less than many other European countries. Three European countries are giving children a head start in PE, France, Austria and Switzerland – offer at least two hours in primary and secondary schools. These findings, from the European Union of Physical Education Associations, prompted specialists in children’s physiology to call on European governments to give youngsters a daily PE programme. The survey shows that the UK ranks 13th out of the 25 countries, with Ireland bottom, averaging under an hour a week for PE. From age six to 18, British children received, on average, 106 minutes of PE a week. Professor Armstrong, who presented the findings at the meeting, noted that since the introduction of the national curriculum there had been a marked fall in the time devoted to PE in UK schools, with only a minority of pupils getting two hours a week.</p>
            <p><strong>D</strong> As a former junior football international, Professor Armstrong is a passionate advocate for sport. Although the Government has poured millions into beefing up sport in the community, there is less commitment to it as part of the crammed school curriculum. This means that many children never acquire the necessary skills to thrive in team games. If they are no good at them, they lose interest and establish an inactive pattern of behaviour. When this is coupled with a poor diet, it will lead inevitably to weight gain. Seventy per cent of British children give up all sport when they leave school, compared with only 20 per cent of French teenagers. Professor Armstrong believes that there is far too great an emphasis on team games at school. “We need to look at the time devoted to PE and balance it between individual and pair activities, such as aerobics and badminton, as well as team sports. “He added that children need to have the opportunity to take part in a wide variety of individual, partner and team sports.</p>
            <p><strong>E</strong> The good news, however, is that a few small companies and children’s activity groups have reacted positively and creatively to the problem. Take That, shouts Gloria Thomas, striking a disco pose astride her mini-spacehopper. Take That, echo a flock of toddlers, adopting outrageous postures astride their space hoppers. ‘Michael Jackson, she shouts, and they all do a spoof fan-crazed shriek. During the wild and chaotic hopper race across the studio floor, commands like this are issued and responded to with untrammelled glee. The sight of 15 bouncing seven-year-olds who seem about to launch into orbit at every bounce brings tears to the eyes. Uncoordinated, loud, excited and emotional, children provide raw comedy.</p>
            <p><strong>F</strong> Any cardiovascular exercise is a good option, and it doesn’t necessarily have to be high intensity. It can be anything that gets your heart rate up: such as walking the dog, swimming, miming, skipping, hiking. “Even walking through the grocery store can be exercise,” Samis-Smith said. What they don’t know is that they’re at a Fit Kids class, and that the fun is a disguise for the serious exercise plan they’re covertly being taken through. Fit Kids trains parents to run fitness classes for children. ‘Ninety per cent of children don’t like team sports,’ says company director, Gillian Gale.</p>
            <p><strong>G</strong> A Prevention survey found that children whose parents keep in shape are much more likely to have healthy body weights themselves. “There’s nothing worse than telling a child what he needs to do and not doing it yourself,” says Elizabeth Ward, R.D., a Boston nutritional consultant and author of Healthy Foods, Healthy Kids. “Set a good example and get your nutritional house in order first.” In the 1930s and ’40s, kids expended 800 calories a day just walking, carrying water, and doing other chores, notes Fima Lifshitz, M.D., a pediatric endocrinologist in Santa Barbara. “Now, kids in obese families are expending only 200 calories a day in physical activity,” says Lifshitz, “incorporate more movement in your family’s lifepark farther away from the stores at the mall, take stairs instead of the elevator, and walk to nearby friends’ houses instead of driving.”</p>
        `,
        questions: `
            <div class="questions-header">
                <h3>Questions (1-13)</h3>
                <p>Read the passage and write or choose the correct answers below.</p>
            </div>
            <form id="quiz-form">
                <!-- Matching Information -->
                <div class="question-block">
                    <p><strong>Questions 1-4:</strong> Which paragraph contains the following information? Write the correct letter A-G.</p>
                    <div style="margin-bottom: 10px;">
                        <input type="text" id="q1" name="q1" class="inline-input" placeholder="A-G" maxlength="1" style="width: 50px;">
                        <label for="q1"> 1. Health and living condition of children</label>
                    </div>
                    <div style="margin-bottom: 10px;">
                        <input type="text" id="q2" name="q2" class="inline-input" placeholder="A-G" maxlength="1" style="width: 50px;">
                        <label for="q2"> 2. Health organization monitored physical activity</label>
                    </div>
                    <div style="margin-bottom: 10px;">
                        <input type="text" id="q3" name="q3" class="inline-input" placeholder="A-G" maxlength="1" style="width: 50px;">
                        <label for="q3"> 3. Comparison of exercise time between UK and other countries</label>
                    </div>
                    <div style="margin-bottom: 10px;">
                        <input type="text" id="q4" name="q4" class="inline-input" placeholder="A-G" maxlength="1" style="width: 50px;">
                        <label for="q4"> 4. Wrong approach for school activity</label>
                    </div>
                </div>

                <!-- True/False/Not Given -->
                <div class="question-block">
                    <p><strong>Questions 5-8:</strong> Do the following statements agree with the information given in the Reading Passage?</p>
                    <p style="font-size: 0.9rem; color: var(--text-muted); margin-bottom: 15px;">
                        <strong>TRUE</strong> if the statement agrees with the information<br>
                        <strong>FALSE</strong> if the statement contradicts the information<br>
                        <strong>NOT GIVEN</strong> if there is no information on this
                    </p>
                    <div style="margin-bottom: 20px;">
                        <p><strong>5. According to American Heart Foundation, cholesterol levels of boys are higher than girls’.</strong></p>
                        <div class="option"><input type="radio" name="q5" id="q5_t" value="TRUE"><label for="q5_t">TRUE</label></div>
                        <div class="option"><input type="radio" name="q5" id="q5_f" value="FALSE"><label for="q5_f">FALSE</label></div>
                        <div class="option"><input type="radio" name="q5" id="q5_ng" value="NOT GIVEN"><label for="q5_ng">NOT GIVEN</label></div>
                    </div>
                    <div style="margin-bottom: 20px;">
                        <p><strong>6. British children generally do less exercise than some other European countries.</strong></p>
                        <div class="option"><input type="radio" name="q6" id="q6_t" value="TRUE"><label for="q6_t">TRUE</label></div>
                        <div class="option"><input type="radio" name="q6" id="q6_f" value="FALSE"><label for="q6_f">FALSE</label></div>
                        <div class="option"><input type="radio" name="q6" id="q6_ng" value="NOT GIVEN"><label for="q6_ng">NOT GIVEN</label></div>
                    </div>
                    <div style="margin-bottom: 20px;">
                        <p><strong>7. Skipping becomes more and more popular in schools of UK.</strong></p>
                        <div class="option"><input type="radio" name="q7" id="q7_t" value="TRUE"><label for="q7_t">TRUE</label></div>
                        <div class="option"><input type="radio" name="q7" id="q7_f" value="FALSE"><label for="q7_f">FALSE</label></div>
                        <div class="option"><input type="radio" name="q7" id="q7_ng" value="NOT GIVEN"><label for="q7_ng">NOT GIVEN</label></div>
                    </div>
                    <div style="margin-bottom: 20px;">
                        <p><strong>8. According to Healthy Kids, the first task is for parents to encourage their children to keep the same healthy body weight.</strong></p>
                        <div class="option"><input type="radio" name="q8" id="q8_t" value="TRUE"><label for="q8_t">TRUE</label></div>
                        <div class="option"><input type="radio" name="q8" id="q8_f" value="FALSE"><label for="q8_f">FALSE</label></div>
                        <div class="option"><input type="radio" name="q8" id="q8_ng" value="NOT GIVEN"><label for="q8_ng">NOT GIVEN</label></div>
                    </div>
                </div>

                <!-- Multiple Choice -->
                <div class="question-block">
                    <p><strong>Questions 9-13:</strong> Choose the correct letter, A, B, C or D.</p>
                    <div style="margin-bottom: 20px; padding-top: 10px;">
                        <p><strong>9. According to paragraph A, what does Professor Neil Armstrong concern about?</strong></p>
                        <div class="option"><input type="radio" name="q9" id="q9_a" value="A"><label for="q9_a">A) Spending more time on TV affect academic level</label></div>
                        <div class="option"><input type="radio" name="q9" id="q9_b" value="B"><label for="q9_b">B) Parents have less time stay with their children</label></div>
                        <div class="option"><input type="radio" name="q9" id="q9_c" value="C"><label for="q9_c">C) Future health of British children</label></div>
                        <div class="option"><input type="radio" name="q9" id="q9_d" value="D"><label for="q9_d">D) Increasing speed of property’s development</label></div>
                    </div>
                    <div style="margin-bottom: 20px;">
                        <p><strong>10. What does Armstrong indicate in Paragraph B?</strong></p>
                        <div class="option"><input type="radio" name="q10" id="q10_a" value="A"><label for="q10_a">A) We need to take a 10 minute walk everyday</label></div>
                        <div class="option"><input type="radio" name="q10" id="q10_b" value="B"><label for="q10_b">B) We should do more activity to exercise heart</label></div>
                        <div class="option"><input type="radio" name="q10" id="q10_c" value="C"><label for="q10_c">C) Girls’ situation is better than boys</label></div>
                        <div class="option"><input type="radio" name="q10" id="q10_d" value="D"><label for="q10_d">D) Exercise can cure many disease</label></div>
                    </div>
                    <div style="margin-bottom: 20px;">
                        <p><strong>11. What is aim of Fit Kids’ trainning?</strong></p>
                        <div class="option"><input type="radio" name="q11" id="q11_a" value="A"><label for="q11_a">A) Make profit by running several sessions</label></div>
                        <div class="option"><input type="radio" name="q11" id="q11_b" value="B"><label for="q11_b">B) Only concentrate on one activity for each child</label></div>
                        <div class="option"><input type="radio" name="q11" id="q11_c" value="C"><label for="q11_c">C) To guide parents how to organize activities for children</label></div>
                        <div class="option"><input type="radio" name="q11" id="q11_d" value="D"><label for="q11_d">D) Spread the idea that team sport is better</label></div>
                    </div>
                    <div style="margin-bottom: 20px;">
                        <p><strong>12. What did Lifshitz suggest in the end of this passage?</strong></p>
                        <div class="option"><input type="radio" name="q12" id="q12_a" value="A"><label for="q12_a">A) Create opportunities to exercise your body</label></div>
                        <div class="option"><input type="radio" name="q12" id="q12_b" value="B"><label for="q12_b">B) Taking elevator saves your time</label></div>
                        <div class="option"><input type="radio" name="q12" id="q12_c" value="C"><label for="q12_c">C) Kids should spend more than 200 calories each day</label></div>
                        <div class="option"><input type="radio" name="q12" id="q12_d" value="D"><label for="q12_d">D) We should never drive but walk</label></div>
                    </div>
                    <div style="margin-bottom: 20px;">
                        <p><strong>13. What is main idea of this passage?</strong></p>
                        <div class="option"><input type="radio" name="q13" id="q13_a" value="A"><label for="q13_a">A) Health of the children who are overweight is at risk in the future</label></div>
                        <div class="option"><input type="radio" name="q13" id="q13_b" value="B"><label for="q13_b">B) Children in UK need proper exercises</label></div>
                        <div class="option"><input type="radio" name="q13" id="q13_c" value="C"><label for="q13_c">C) Government mistaken approach for children</label></div>
                        <div class="option"><input type="radio" name="q13" id="q13_d" value="D"><label for="q13_d">D) Parents play the most important role in children’s activity</label></div>
                    </div>
                </div>
            </form>
        `,
        answers: {
            "q1": { answer: "B", explanation: "Paragraph B mentions findings on overweight children, cholesterol levels, and exercise." },
            "q2": { answer: "C", explanation: "Paragraph C states: 'These findings, from the European Union of Physical Education Associations, prompted specialists...'" },
            "q3": { answer: "C", explanation: "Paragraph C compares the UK's 106 minutes with France, Austria, and Switzerland." },
            "q4": { answer: "D", explanation: "Paragraph D explains that placing too great an emphasis on team games at school is a wrong approach as it alienates some kids." },
            "q5": { answer: "NOT GIVEN", explanation: "The text says 48% girls and 41% boys exceeded levels, but doesn't explicitly state boys' cholesterol was higher." },
            "q6": { answer: "TRUE", explanation: "Paragraph C confirms UK schools devote little more than 100 minutes... less than many other European countries." },
            "q7": { answer: "NOT GIVEN", explanation: "Skipping is mentioned as good cardiovascular exercise in F, but not its popularity in UK schools." },
            "q8": { answer: "TRUE", explanation: "Paragraph G states Ward from Healthy Kids advises parents to get their nutritional house in order first." },
            "q9": { answer: "C", explanation: "Paragraph A quotes Armstrong: 'If children continue to be this inactive, they’ll be storing up big problems for the future.'" },
            "q10": { answer: "B", explanation: "Paragraph B quotes Armstrong: 'heart is a muscle and need exercise, or it loses its strength.'" },
            "q11": { answer: "C", explanation: "Paragraph F states: 'Fit Kids trains parents to run fitness classes for children.'" },
            "q12": { answer: "A", explanation: "Paragraph G quotes Lifshitz advising parents to 'incorporate more movement in your family’s life...'" },
            "q13": { answer: "B", explanation: "The entire passage revolves around the lack of activity in UK children and the need to increase and diversify physical exercise." }
        }
    },

    "the_importance_of_law": {
        title: "The Importance of Law",
        source: "basic-ielts",
        passage: `
            <h2>The Importance of Law</h2>
            <p>The law is a system of rules that a society or government develops in order to deal with crime, business agreements, and social relationships. You can also use the law to refer to the people who work in this system. Laws control the lesser-known aspects of our lives, such as the quality of the air we breathe and the safety of the food we eat.</p>
            <p>No society could exist if all people did just as they pleased, without respecting the rights of others. Every country has a system of criminal law to protect society as a whole. Criminal laws deal with actions that threaten people, property, or society itself. Such actions are called crimes. Laws provide for the punishment of people who commit crimes. By punishing criminals, a government hopes to discourage crime.</p>
            <p>Laws also protect property and the environment. Without laws, people might steal each other's possessions or dump harmful chemicals into lakes and rivers. Ultimately, a strong legal system helps ensure fairness and equality in a civilized society.</p>
        `,
        questions: `
            <div class="questions-header">
                <h3>Questions (1-4)</h3>
                <p>Read the passage and choose the correct answers below.</p>
            </div>
            <form id="quiz-form">
                <div class="question-block">
                    <p><strong>1. What is the primary purpose of criminal laws?</strong></p>
                    <div class="option"><input type="radio" name="q1" id="q1_a" value="A"><label for="q1_a">A) To regulate business agreements</label></div>
                    <div class="option"><input type="radio" name="q1" id="q1_b" value="B"><label for="q1_b">B) To protect society from harmful actions</label></div>
                    <div class="option"><input type="radio" name="q1" id="q1_c" value="C"><label for="q1_c">C) To ensure the safety of food</label></div>
                </div>
                <div class="question-block">
                    <p><strong>2. How does a government hope to discourage crime?</strong></p>
                    <div class="option"><input type="radio" name="q2" id="q2_a" value="A"><label for="q2_a">A) By writing more laws</label></div>
                    <div class="option"><input type="radio" name="q2" id="q2_b" value="B"><label for="q2_b">B) By punishing criminals</label></div>
                    <div class="option"><input type="radio" name="q2" id="q2_c" value="C"><label for="q2_c">C) By protecting the environment</label></div>
                </div>
                <div class="question-block">
                    <p><strong>3. Fill in the blank: (1 word)</strong></p>
                    <p>Laws control the <input type="text" id="q3" name="q3" class="inline-input" placeholder="..."> aspects of our lives, such as the air we breathe.</p>
                </div>
                <div class="question-block">
                    <p><strong>4. "A strong legal system helps ensure fairness in society". Based on the text, is this statement: </strong></p>
                    <div class="option"><input type="radio" name="q4" id="q4_a" value="True"><label for="q4_a">True</label></div>
                    <div class="option"><input type="radio" name="q4" id="q4_b" value="False"><label for="q4_b">False</label></div>
                    <div class="option"><input type="radio" name="q4" id="q4_c" value="Not Given"><label for="q4_c">Not Given</label></div>
                </div>
            </form>
        `,
        answers: {
            "q1": { answer: "B", explanation: "Paragraph 2 states: 'Criminal laws deal with actions that threaten people...'" },
            "q2": { answer: "B", explanation: "Paragraph 2 states: 'By punishing criminals, a government hopes to discourage crime.'" },
            "q3": { answer: "lesser-known", explanation: "Paragraph 1 states: 'Laws control the lesser-known aspects of our lives...'" },
            "q4": { answer: "True", explanation: "Paragraph 3 clearly says: 'Ultimately, a strong legal system helps ensure fairness...'" }
        }
    },

    "australian_culture": {
        title: "Australian culture and culture shock",
        source: "mini-ielts",
        passage: `
            <h2>Australian culture and culture shock</h2>
            <p><strong>A</strong> Sometimes work, study or an sense of adventure take us out of our familiar surroundings to go and live in a different culture. The experience can be difficult, even shocking. Almost everyone who studies, lives or works abroad has problems adjusting to a new culture. This response is commonly referred to as 'culture shock'. Culture shock can be defined as 'the physical and emotional discomfort a person experiences when entering a culture different from their own' (Weaver, 1993).</p>
            <p><strong>B</strong> For people moving to Australia, Price (2001) has identified certain values which may give rise to culture shock. Firstly, he argues that Australians place a high value on independence and personal choice. This means that a teacher or course tutor will not tell students what to do, but will give them a number of options and suggest they work out which one is the best in their circumstances. It also means that they are expected to take action if something goes wrong and seek out resources and support for themselves.</p>
            <p><strong>C</strong> Australians are also prepared to accept a range of opinions rather than believing there is one truth. This means that in an educational setting, students will be expected to form their own opinions and defend the reasons for that point of view and the evidence for it.</p>
            <p><strong>D</strong> Price also comments that Australians are uncomfortable with differences in status and hence idealise the idea of treating everyone equally. An illustration of this is that most adult Australians call each other by their first names. This concern with equality means that Australians are uncomfortable taking anything too seriously and are even ready to joke about themselves.</p>
            <p><strong>E</strong> Australians believe that life should have a balance between work and leisure time. As a consequence, some students may be critical of others who they perceive as doing nothing but study.</p>
            <p><strong>F</strong> Australian notions of privacy mean that areas such as financial matters, appearance and relationships are only discussed with close friends. While people may volunteer such information, they may resent someone actually asking them unless the friendship is firmly established. Even then, it is considered very impolite to ask someone what they earn. With older people, it is also rude to ask how old they are, why they are not married or why they do not have children. It is also impolite to ask people how much they have paid for something, unless there is a very good reason for asking.</p>
            <p><strong>G</strong> Kohls (1996) describes culture shock as a process of change marked by four basic stages. During the first stage, the new arrival is excited to be in a new place, so this is often referred to as the "honeymoon" stage. Like a tourist, they are intrigued by all the new sights and sounds, new smells and tastes of their surroundings. They may have some problems, but usually they accept them as just part of the novelty. At this point, it is the similarities that stand out, and it seems to the newcomer that people everywhere and their way of life are very much alike. This period of euphoria may last from a couple of weeks to a month, but the letdown is inevitable.</p>
            <p><strong>H</strong> During the second stage, known as the 'rejection' stage, the newcomer starts to experience difficulties due to the differences between the new culture and the way they were accustomed to living. The initial enthusiasm turns into irritation, frustration, anger and depression, and these feelings may have the effect of people rejecting the new culture so that they notice only the things that cause them trouble, which they then complain about. In addition, they may feel homesick, bored, withdrawn and irritable during this period as well.</p>
            <p><strong>I</strong> Fortunately, most people gradually learn to adapt to the new culture and move on to the third stage, known as 'adjustment and reorientation'. During this stage a transition occurs to a new optimistic attitude. As the newcomer begins to understand more of the new culture, they are able to interpret some of the subtle cultural clues which passed by unnoticed earlier. Now things make more sense and the culture seems more familiar. As a result, they begin to develop problem-solving skills, and feelings of disorientation and anxiety no longer affect them.</p>
            <p><strong>J</strong> In Kohls's model, in the fourth stage, newcomers undergo a process of adaptation. They have settled into the new culture, and this results in a feeling of direction and self-confidence. They have accepted the new food, drinks, habits and customs and may even find themselves enjoying some of the very customs that bothered them so much previously. In addition, they realise that the new culture has good and bad things to offer and that no way is really better than another, just different.</p>
        `,
        questions: `
            <div class="questions-header">
                <h3>Questions (1-13)</h3>
                <p>Read the passage and write or choose the correct answers below.</p>
            </div>
            <form id="quiz-form">
                <!-- True/False/Not Given -->
                <div class="question-block">
                    <p><strong>Questions 1-6:</strong> Do the following statements agree with the information given in the Reading Passage?</p>
                    <p style="font-size: 0.9rem; color: var(--text-muted); margin-bottom: 15px;">
                        <strong>TRUE</strong> if the statement agrees with the information<br>
                        <strong>FALSE</strong> if the statement contradicts the information<br>
                        <strong>NOT GIVEN</strong> if there is no information on this
                    </p>
                    <div style="margin-bottom: 20px;">
                        <p><strong>1. Australian teachers will suggest alternatives to students rather than offer one solution.</strong></p>
                        <div class="option"><input type="radio" name="q1" id="q1_t" value="TRUE"><label for="q1_t">TRUE</label></div>
                        <div class="option"><input type="radio" name="q1" id="q1_f" value="FALSE"><label for="q1_f">FALSE</label></div>
                        <div class="option"><input type="radio" name="q1" id="q1_ng" value="NOT GIVEN"><label for="q1_ng">NOT GIVEN</label></div>
                    </div>
                    <div style="margin-bottom: 20px;">
                        <p><strong>2. In Australia, teachers will show interest in students’ personal circumstances.</strong></p>
                        <div class="option"><input type="radio" name="q2" id="q2_t" value="TRUE"><label for="q2_t">TRUE</label></div>
                        <div class="option"><input type="radio" name="q2" id="q2_f" value="FALSE"><label for="q2_f">FALSE</label></div>
                        <div class="option"><input type="radio" name="q2" id="q2_ng" value="NOT GIVEN"><label for="q2_ng">NOT GIVEN</label></div>
                    </div>
                    <div style="margin-bottom: 20px;">
                        <p><strong>3. Australians use people’s first names so that everyone feels their status is similar.</strong></p>
                        <div class="option"><input type="radio" name="q3" id="q3_t" value="TRUE"><label for="q3_t">TRUE</label></div>
                        <div class="option"><input type="radio" name="q3" id="q3_f" value="FALSE"><label for="q3_f">FALSE</label></div>
                        <div class="option"><input type="radio" name="q3" id="q3_ng" value="NOT GIVEN"><label for="q3_ng">NOT GIVEN</label></div>
                    </div>
                    <div style="margin-bottom: 20px;">
                        <p><strong>4. Students who study all the time may receive positive comments from their colleagues.</strong></p>
                        <div class="option"><input type="radio" name="q4" id="q4_t" value="TRUE"><label for="q4_t">TRUE</label></div>
                        <div class="option"><input type="radio" name="q4" id="q4_f" value="FALSE"><label for="q4_f">FALSE</label></div>
                        <div class="option"><input type="radio" name="q4" id="q4_ng" value="NOT GIVEN"><label for="q4_ng">NOT GIVEN</label></div>
                    </div>
                    <div style="margin-bottom: 20px;">
                        <p><strong>5. It is acceptable to discuss financial issues with people you do not know well.</strong></p>
                        <div class="option"><input type="radio" name="q5" id="q5_t" value="TRUE"><label for="q5_t">TRUE</label></div>
                        <div class="option"><input type="radio" name="q5" id="q5_f" value="FALSE"><label for="q5_f">FALSE</label></div>
                        <div class="option"><input type="radio" name="q5" id="q5_ng" value="NOT GIVEN"><label for="q5_ng">NOT GIVEN</label></div>
                    </div>
                    <div style="margin-bottom: 20px;">
                        <p><strong>6. Younger Australians tend to be friendlier than older Australians.</strong></p>
                        <div class="option"><input type="radio" name="q6" id="q6_t" value="TRUE"><label for="q6_t">TRUE</label></div>
                        <div class="option"><input type="radio" name="q6" id="q6_f" value="FALSE"><label for="q6_f">FALSE</label></div>
                        <div class="option"><input type="radio" name="q6" id="q6_ng" value="NOT GIVEN"><label for="q6_ng">NOT GIVEN</label></div>
                    </div>
                </div>

                <!-- Table Completion -->
                <div class="question-block">
                    <p><strong>Questions 7-13:</strong> Complete the table below. Choose NO MORE THAN TWO WORDS from the passage for each answer.</p>
                    <div style="background:var(--bg-color); padding: 15px; border-radius: 8px;">
                        <h4>THE STAGES OF CULTURE SHOCK</h4>
                        <p><strong>Stage 1:</strong> Newcomers' reaction: <input type="text" id="q7" name="q7" class="inline-input" placeholder="...">. They notice the <input type="text" id="q8" name="q8" class="inline-input" placeholder="..."> between different nationalities and cultures. They may experience this stage for up to <input type="text" id="q9" name="q9" class="inline-input" placeholder="...">.</p>
                        <p><strong>Stage 2 (Rejection):</strong> They reject the new culture and lose the <input type="text" id="q10" name="q10" class="inline-input" placeholder="..."> they had at the beginning.</p>
                        <p><strong>Stage 3 (Adjustment and reorientation):</strong> They can understand some <input type="text" id="q11" name="q11" class="inline-input" placeholder="..."> which they had not previously observed. They learn <input type="text" id="q12" name="q12" class="inline-input" placeholder="..."> for dealing with difficulties.</p>
                        <p><strong>Stage 4 (<input type="text" id="q13" name="q13" class="inline-input" placeholder="...">):</strong> They enjoy some of the customs that annoyed them before.</p>
                    </div>
                </div>
            </form>
        `,
        answers: {
            "q1": { answer: "TRUE", explanation: "Paragraph B states: 'give them a number of options and suggest they work out...'" },
            "q2": { answer: "NOT GIVEN", explanation: "There is no information regarding teachers showing interest in personal circumstances." },
            "q3": { answer: "TRUE", explanation: "Paragraph D states: 'Australians are uncomfortable with differences in status and hence idealise... treating everyone equally.'" },
            "q4": { answer: "FALSE", explanation: "Paragraph E states: 'some students may be critical of others who they perceive as doing nothing but study.'" },
            "q5": { answer: "FALSE", explanation: "Paragraph F states: 'financial matters... are only discussed with close friends.'" },
            "q6": { answer: "NOT GIVEN", explanation: "The text does not compare the friendliness of younger vs older Australians." },
            "q7": { answer: "Honeymoon", explanation: "Paragraph G mentions the first stage is often referred to as the 'honeymoon' stage." },
            "q8": { answer: "similarities", explanation: "Paragraph G: 'it is the similarities that stand out'" },
            "q9": { answer: "one month", explanation: "Paragraph G: 'This period of euphoria may last from a couple of weeks to a month'" },
            "q10": { answer: "enthusiasm", explanation: "Paragraph H describes the rejection stage: 'The initial enthusiasm turns into irritation...'" },
            "q11": { answer: "clues", explanation: "Paragraph I: 'interpret some of the subtle cultural clues which passed by unnoticed earlier.'" },
            "q12": { answer: "skills", explanation: "Paragraph I: 'begin to develop problem-solving skills'" },
            "q13": { answer: "adaptation", explanation: "Paragraph J: 'in the fourth stage, newcomers undergo a process of adaptation.'" }
        }
    }
};

// Barcha eshitish (Listening) testlarini saqlovchi ma'lumotlar ombori
const LISTENING_TEST_DATA = {

    "theatre_trip_munich": {
        title: "Theatre trip to Munich",
        source: "mini-ielts",
        audio_src: "l_audio.mp3", // Namuna sifatida
        passage: `
            <h2>Theatre trip to Munich</h2>
            <p>Listen to the audio and answer the questions on the right.</p>
            <div style="background: var(--surface-color); padding: 15px; border-radius: 8px; margin-top:20px;">
                <h4>Comments (For Questions 6-10)</h4>
                <p><strong>A</strong> The playwright will be present.</p>
                <p><strong>B</strong> The play was written to celebrate an anniversary.</p>
                <p><strong>C</strong> The play will be performed inside a historic building.</p>
                <p><strong>D</strong> The play will be accompanied by live music.</p>
                <p><strong>E</strong> The play will be performed outdoors.</p>
                <p><strong>F</strong> The play will be performed for the first time.</p>
                <p><strong>G</strong> The performance will be attended by officials from the town.</p>
            </div>
        `,
        questions: `
            <form id="quiz-form">
                <div class="questions-header">
                    <h3>Questions (1-5)</h3>
                    <p>Choose the correct letter, A, B or C.</p>
                </div>

                <div class="question-block" id="block-q1">
                    <p><strong>1. When the group meet at the airport they will have</strong></p>
                    <div class="option"><input type="radio" name="q1_listen" id="q1_a" value="A"><label for="q1_a">A) breakfast.</label></div>
                    <div class="option"><input type="radio" name="q1_listen" id="q1_b" value="B"><label for="q1_b">B) coffee.</label></div>
                    <div class="option"><input type="radio" name="q1_listen" id="q1_c" value="C"><label for="q1_c">C) lunch.</label></div>
                </div>

                <div class="question-block" id="block-q2">
                    <p><strong>2. The group will be met at Munich Airport by</strong></p>
                    <div class="option"><input type="radio" name="q2_listen" id="q2_a" value="A"><label for="q2_a">A) an employee at the National Theatre.</label></div>
                    <div class="option"><input type="radio" name="q2_listen" id="q2_b" value="B"><label for="q2_b">B) a theatre manager.</label></div>
                    <div class="option"><input type="radio" name="q2_listen" id="q2_c" value="C"><label for="q2_c">C) a tour operator.</label></div>
                </div>

                <div class="question-block" id="block-q3">
                    <p><strong>3. How much will they pay per night for a double room at the hotel?</strong></p>
                    <div class="option"><input type="radio" name="q3_listen" id="q3_a" value="A"><label for="q3_a">A) 110 euros</label></div>
                    <div class="option"><input type="radio" name="q3_listen" id="q3_b" value="B"><label for="q3_b">B) 120 euros</label></div>
                    <div class="option"><input type="radio" name="q3_listen" id="q3_c" value="C"><label for="q3_c">C) 150 euros</label></div>
                </div>

                <div class="question-block" id="block-q4">
                    <p><strong>4. What type of restaurant will they go to on Tuesday evening?</strong></p>
                    <div class="option"><input type="radio" name="q4_listen" id="q4_a" value="A"><label for="q4_a">A) an Italian restaurant</label></div>
                    <div class="option"><input type="radio" name="q4_listen" id="q4_b" value="B"><label for="q4_b">B) a Lebanese restaurant</label></div>
                    <div class="option"><input type="radio" name="q4_listen" id="q4_c" value="C"><label for="q4_c">C) a typical restaurant of the region</label></div>
                </div>

                <div class="question-block" id="block-q5">
                    <p><strong>5. Who will they meet on Wednesday afternoon?</strong></p>
                    <div class="option"><input type="radio" name="q5_listen" id="q5_a" value="A"><label for="q5_a">A) an actor</label></div>
                    <div class="option"><input type="radio" name="q5_listen" id="q5_b" value="B"><label for="q5_b">B) a playwright</label></div>
                    <div class="option"><input type="radio" name="q5_listen" id="q5_c" value="C"><label for="q5_c">C) a theatre director</label></div>
                </div>

                <div class="questions-header" style="margin-top: 30px;">
                    <h3>Questions (6-10)</h3>
                    <p>What does the man say about the play on each of the following days? Choose FIVE answers from the box (A-G) and write the correct letter.</p>
                </div>

                <div class="question-block" id="block-q6">
                    <p><strong>6. Wednesday</strong></p>
                    <input type="text" id="q6_listen" name="q6_listen" class="inline-input" placeholder="A-G" maxlength="1" style="width: 60px;">
                </div>
                
                <div class="question-block" id="block-q7">
                    <p><strong>7. Thursday</strong></p>
                    <input type="text" id="q7_listen" name="q7_listen" class="inline-input" placeholder="A-G" maxlength="1" style="width: 60px;">
                </div>

                <div class="question-block" id="block-q8">
                    <p><strong>8. Friday</strong></p>
                    <input type="text" id="q8_listen" name="q8_listen" class="inline-input" placeholder="A-G" maxlength="1" style="width: 60px;">
                </div>

                <div class="question-block" id="block-q9">
                    <p><strong>9. Saturday</strong></p>
                    <input type="text" id="q9_listen" name="q9_listen" class="inline-input" placeholder="A-G" maxlength="1" style="width: 60px;">
                </div>

                <div class="question-block" id="block-q10">
                    <p><strong>10. Monday</strong></p>
                    <input type="text" id="q10_listen" name="q10_listen" class="inline-input" placeholder="A-G" maxlength="1" style="width: 60px;">
                </div>

            </form>
        `,
        answers: {
            "q1_listen": { answer: "B", explanation: "The speaker says: '...meet there for coffee at 10...'" },
            "q2_listen": { answer: "C", explanation: "The speaker says: 'Claus works for a tour operator, and he’ll look after us...'" },
            "q3_listen": { answer: "A", explanation: "The speaker says: '...negotiate a rate of 110.'" },
            "q4_listen": { answer: "B", explanation: "The speaker says: '...decided to book a Lebanese one.'" },
            "q5_listen": { answer: "C", explanation: "The speaker says: '...director of the play we’re going to see that evening will talk to us at the theatre.'" },
            "q6_listen": { answer: "F", explanation: "The speaker says: '...going to the premiere...'" },
            "q7_listen": { answer: "B", explanation: "The speaker says: '...commissioned to mark a hundred years since the birth...'" },
            "q8_listen": { answer: "E", explanation: "The speaker says: '...in the garden of a palace...'" },
            "q9_listen": { answer: "G", explanation: "The speaker says: '...mayor and all the other dignitaries of the town will be attending.'" },
            "q10_listen": { answer: "C", explanation: "The speaker says: '...stunning setting of the old Town Hall which dates back to the 14th century.'" }
        }
    },

    "engineering_sustainable": {
        title: "Engineering for sustainable development",
        source: "mini-ielts",
        audio_src: "l_audio.mp3", // Namuna sifatida
        passage: `
            <h2>Engineering for sustainable development</h2>
            <p>Listen to the audio and answer the questions on the right.</p>
        `,
        questions: `
            <form id="quiz-form">
                <div class="questions-header">
                    <h3>Questions (1-10)</h3>
                    <p>Complete the notes below. Write <strong>ONE WORD ONLY</strong> for each answer.</p>
                </div>
                
                <div style="background:var(--bg-color); padding: 15px; border-radius: 8px;">
                    <h3 style="margin-top:0;">The Greenhouse Project (Himalayan mountain region)</h3>
                    
                    <h4>Problem</h4>
                    <ul>
                        <li class="question-block" id="block-q1" style="border:none; padding:5px 0; box-shadow:none; background:transparent;">Short growing season because of high altitude and low <input type="text" id="q1_listen" name="q1_listen" class="inline-input" placeholder="..."></li>
                        <li class="question-block" id="block-q2" style="border:none; padding:5px 0; box-shadow:none; background:transparent;">Fresh vegetables imported by lorry or by <input type="text" id="q2_listen" name="q2_listen" class="inline-input" placeholder="...">, so are expensive</li>
                        <li class="question-block" id="block-q3" style="border:none; padding:5px 0; box-shadow:none; background:transparent;">Need to use sunlight to prevent local plants from <input type="text" id="q3_listen" name="q3_listen" class="inline-input" placeholder="..."></li>
                        <li class="question-block" id="block-q4" style="border:none; padding:5px 0; box-shadow:none; background:transparent;">Previous programmes to provide greenhouses were <input type="text" id="q4_listen" name="q4_listen" class="inline-input" placeholder="..."></li>
                    </ul>

                    <h4>New greenhouse - Meets criteria for sustainability</h4>
                    <ul>
                        <li class="question-block" id="block-q5" style="border:none; padding:5px 0; box-shadow:none; background:transparent;">Simple and <input type="text" id="q5_listen" name="q5_listen" class="inline-input" placeholder="..."> to build</li>
                        <li class="question-block" id="block-q6" style="border:none; padding:5px 0; box-shadow:none; background:transparent;">Made mainly from local materials (mud or stone for the walls, wood and <input type="text" id="q6_listen" name="q6_listen" class="inline-input" placeholder="..."> for the roof)</li>
                        <li>Building and maintenance done by local craftsmen</li>
                        <li class="question-block" id="block-q7" style="border:none; padding:5px 0; box-shadow:none; background:transparent;">Puns solely on <input type="text" id="q7_listen" name="q7_listen" class="inline-input" placeholder="..."> energy</li>
                        <li class="question-block" id="block-q8" style="border:none; padding:5px 0; box-shadow:none; background:transparent;">Only families who have a suitable <input type="text" id="q8_listen" name="q8_listen" class="inline-input" placeholder="..."> can own one</li>
                    </ul>

                    <h4>Design</h4>
                    <ul>
                        <li>Long side faces south</li>
                        <li>Strong polythene cover</li>
                        <li class="question-block" id="block-q9" style="border:none; padding:5px 0; box-shadow:none; background:transparent;">Inner <input type="text" id="q9_listen" name="q9_listen" class="inline-input" placeholder="..."> are painted black or white</li>
                    </ul>

                    <h4>Social benefits</h4>
                    <ul>
                        <li>Owners’ status is improved</li>
                        <li class="question-block" id="block-q10" style="border:none; padding:5px 0; box-shadow:none; background:transparent;">Rural <input type="text" id="q10_listen" name="q10_listen" class="inline-input" placeholder="..."> have greater opportunities</li>
                        <li>More children are educated</li>
                    </ul>
                </div>
            </form>
        `,
        answers: {
            "q1_listen": { answer: "rainfall", explanation: "The altitude of the region is around 3500 metres, and the rainfall is so low." },
            "q2_listen": { answer: "air", explanation: "They arrive by truck in summer or by air in winter, which makes them expensive." },
            "q3_listen": { answer: "freezing", explanation: " exploit the sun’s energy and protect locally produced plants from freezing during winter." },
            "q4_listen": { answer: "unsuccessful", explanation: "there had been programmes in the past to provide greenhouses, but these were unsuccessful." },
            "q5_listen": { answer: "cheap", explanation: "the new greenhouse is designed to be relatively simple, so construction is cheap." },
            "q6_listen": { answer: "grass", explanation: "The main roof is generally made from locally available poplar wood, with water-resistant local grass for the covering." },
            "q7_listen": { answer: "solar", explanation: "the greenhouse is designed to run on solar power alone" },
            "q8_listen": { answer: "site", explanation: "They have to have a site which is suitable for constructing it on." },
            "q9_listen": { answer: "walls", explanation: "On the inside of the greenhouse, the walls are painted..." },
            "q10_listen": { answer: "women", explanation: "because in rural areas it is women who usually grow the food, the greenhouses have increased their opportunities." }
        }
    }
};

// Agar typeof module bo'lsa (Nodejs) export qilamiz
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { TEST_DATA, LISTENING_TEST_DATA };
}
