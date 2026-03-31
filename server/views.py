from flask import jsonify, abort, make_response, request, url_for
from .app import app, db
from .models import Questionnaire



@app.route('/quiz/api/v1.0/questionnaires', methods=['GET'])
def get_questionnaires():
    public_questionnaires = []
    all_questionnaires = Questionnaire.get_questionnaires()
    
    for questionnaire in all_questionnaires:
        public_questionnaires.append(questionnaire.questionnaire_to_json())
        
    return jsonify({'questionnaires': public_questionnaires})



@app.route('/quiz/api/v1.0/questionnaires/<int:questionnaire_id>', methods=['GET'])
def get_questionnaire(questionnaire_id):
    questionnaire = Questionnaire.get_questionnaire(questionnaire_id)
    if questionnaire is None:
        return abort(404)
    
    questionnaire.questionnaire_to_json()
    return jsonify({'questionnaires': questionnaire.questionnaire_to_json()})



@app.route('/quiz/api/v1.0/questionnaires', methods=['POST'])
def create_questionnaire():
    if not request.json or not 'nom' in request.json:
        return abort(400)
    
    nom_questionnaire = request.json['nom']
    nouvelle_quest = Questionnaire.create_questionnaire(nom_questionnaire)
    db.session.commit()
    return jsonify({'result': nouvelle_quest.questionnaire_to_json()}), 201



@app.route('/quiz/api/v1.0/questionnaires/<int:questionnaire_id>', methods=['PUT'])
def update_questionnaire(questionnaire_id):
    if not request.json or not 'nom' in request.json:
        return abort(400)
    
    new_nom = request.json['nom']
    update_quest = Questionnaire.update_questionnaire(questionnaire_id, new_nom)
    if update_quest is None:
        return abort(404)
    return jsonify({'result': update_quest.questionnaire_to_json()}), 201



@app.route('/quiz/api/v1.0/questionnaires/<int:questionnaire_id>', methods=['DELETE'])
def delete_questionnaire(questionnaire_id):
    boolean = Questionnaire.delete_questionnaire(questionnaire_id)
    if not boolean:
        return abort(404)
    return jsonify({"status": "deleted"})



@app.route('/quiz/api/v1.0/questionnaires/<int:questionnaire_id>', methods=['POST'])
def create_question(questionnaire_id):
    if not request.json or not 'enonce' in request.json:
        return abort(400)
    
    questionnaire = Questionnaire.get_questionnaire(questionnaire_id)
    if not questionnaire:
        return abort(404)
    
    if not "ind_reponse" in request.json and not "propositions" in request.json:
        if not "reponse" in request.json:
            return abort(400)
        enonce = request.json['enonce']
        reponse = request.json['reponse']
        question = questionnaire.add_question_ouverte(enonce, reponse)

    else:
        if not "ind_reponse" in request.json or not "propositions" in request.json:
            return abort(400)
        enonce = request.json['enonce']
        ind_reponse = request.json['ind_reponse']
        propositions = request.json['propositions']
        if len(propositions) != 2:
            return abort(400, description="Chaque question doit avoir au moins 2 propositions.")
        question = questionnaire.add_question_ferme(enonce, propositions[0], propositions[1], ind_reponse)
    
    db.session.add(question)
    db.session.commit()
    return jsonify({'result': question.question_to_json()}), 201



@app.route('/quiz/api/v1.0/questionnaires/<int:questionnaire_id>/questions/<int:question_num>', methods=['DELETE'])
def delete_question(questionnaire_id, question_num):
    questionnaire = Questionnaire.get_questionnaire(questionnaire_id)
    if not questionnaire:
        return abort(404)
    
    boolean = questionnaire.supp_question(question_num)
    if not boolean:
        return abort(404)
    
    db.session.commit()
    return jsonify({"status": "deleted"})



@app.route('/quiz/api/v1.0/questionnaires/<int:questionnaire_id>/questions/<int:question_num>', methods=['GET'])
def get_questions(questionnaire_id, question_num):
    questionnaire = Questionnaire.get_questionnaire(questionnaire_id)
    if not questionnaire:
        return abort(404)
    
    question = questionnaire.get_question(question_num)
    if question is None:
        return abort(404)
    
    return jsonify({'result': question.question_to_json()}), 201


@app.route('/quiz/api/v1.0/questionnaires/<int:questionnaire_id>/questions/<int:question_num>', methods=['PUT'])
def update_question(questionnaire_id, question_num):
    if not request.json:
        return abort(400)

    questionnaire = Questionnaire.get_questionnaire(questionnaire_id)
    if not questionnaire:
        return abort(404)

    question = questionnaire.get_question(question_num)
    if question is None:
        return abort(404)

    if 'enonce' in request.json:
        question.enonce = request.json['enonce']

    if hasattr(question, 'reponse') and 'reponse' in request.json:
        question.reponse = request.json['reponse']

    if hasattr(question, 'proposition1') and hasattr(question, 'proposition2'):
        if 'propositions' in request.json:
            propositions = request.json['propositions']
            if len(propositions) != 2:
                return abort(400, description='Chaque question doit avoir exactement 2 propositions.')
            question.proposition1 = propositions[0]
            question.proposition2 = propositions[1]

        if 'ind_reponse' in request.json:
            question.ind_reponse = request.json['ind_reponse']

    db.session.commit()
    return jsonify({'result': question.question_to_json()}), 200



@app.errorhandler(404)
def not_found(error):
    return make_response(jsonify({'error' : "Not found"}), 404)

@app.errorhandler(400)
def bad_request(error):
    return make_response(jsonify({'error': 'Bad request'}), 400)