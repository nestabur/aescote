(function () {
    angular.module('OcrService', []).factory('OcrService', ocrService);

    ocrService.$inject = ['$q'];

    function ocrService($q) {
        return {
            processFile: processFile
        };

        function processFile(fileEntry){
            var defer = $q.defer();

            // Get file info : name, uri, type
            var fileType = null;
            fileEntry.file(function(file) { fileType = file.type; }, null);
            var fileName = fileEntry.name;
            var fileURI = fileEntry.fullPath;

            // File upload options
            var options = new FileUploadOptions();

            options.fileKey = "image";
            options.fileName = fileName;
            options.mimeType = fileType;
            options.chunkedMode = false;

            // Adding language and apikey parameters in the request
            var params = {};
            params.language = 'DE';
            params.apikey = 'xscNtXpApd';
            options.params = params;

            // Doing request
            var fileTransfer = new FileTransfer();

            fileTransfer.upload(fileURI, "http://api.ocrapiservice.com/1.0/rest/ocr", function(response) {
                // Showing response data
                if (response.responseCode == 200) {
                    //$("#resultText").html("Success");
                } else {
                    $scope.errorReadingFile = response;
                }

                // Request successfully completed
                var result = decodeURIComponent(response.response);

                defer.resolve(result);
            }, function(error) {
                defer.reject(error);
            }, options);

            return defer.promise;
        }

    }

})();
