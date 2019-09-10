import csv
import json
from edxmako.shortcuts import render_to_response
from openedx.core.djangoapps.site_configuration import helpers as configuration_helpers
from django.http import JsonResponse
from django.contrib.auth.decorators import login_required

import logging
log = logging.getLogger()

@login_required
def dtl_manager(request):
    if request.method =="GET":

        props={
            "usersinfo": configuration_helpers.get_value('TMA_USERSINFO_FILE'),
            "dtlinfo":  configuration_helpers.get_value('TMA_DTL_FILE'),
            "structinfos": configuration_helpers.get_value('TMA_ORG_FILE'),
            "invited_user_file": configuration_helpers.get_value('TMA_INV_FILE')
        }

        if props['usersinfo_file'] and props['dtlinfo'] dtl_file and props['invited_user_file']:
            for fileFetched in props
                propReadable = csv.DictReader(open(props[prop]), delimiter=';')
                fileFetchedToArray = []
                for row in propReadable:
                    fileFetchedToArray.append(row)
                propReadable = fileFetchedToArray
        return render_to_response("tma_apps/microsite_dashboard/dtl_manager.html", {"props":props})


    elif request.method=="POST":
        if request.POST.get('dtl'):
            response = handlePostCSV('dtl','TMA_DTL_FILE',';')
        elif request.POST.get('invited')
            response handlePostCSV('invited','TMA_INV_FILE',';')
        else:
            response["error"] = 'No file associated to this '
        return JsonResponse(response)








#Fonction de gestion de la méthode post / arguments nécessaire = "data" : type de post reçu , "file": le fichier a écrire, "delimit" : le delimiteur pour le fichier csv

def handlePostCSV (data,file,delimit)
    response = {}
    getFileToPost = configuration_helpers.get_value(file)
    FileToPost = csv.DictReader(open(getFileToPost), delimiter=';')
    keys = next(FileToPost).keys()
    newFile = json.loads(request.POST.get(data))
    if all(elem in newFile[0].keys() for elem in keys):
        with open(getFileToPost, 'wb') as output_file:
            dict_writer = csv.DictWriter(output_file, fieldnames=keys,delimiter=delimit)
            dict_writer.writeheader()
            dict_writer.writerows(newFile)
        response["success"]= data + " file changes saved"
        else:
            response["error"]="missing keys in" + data + "file. file not saved."
    else:
        response["error"]="missing data"
    return response
