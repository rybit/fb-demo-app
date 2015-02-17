from django.db import models

class PageId (models.Model):
    val = models.TextField();

    def __str__(self):
        return self.val;

class PendingPost(models.Model):
    page = models.TextField()
    creator = models.TextField()
    date = models.DateTimeField()
    text = models.TextField()
    img_path = models.FilePathField()
