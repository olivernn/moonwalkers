require 'rake'
require 'json'
require 'erb'

class Template
  Bio = Struct.new(:name, :body)

  def self.render(corpus_path, template_path)
    new(corpus_path, template_path).render
  end

  def initialize(corpus_path, template_path)
    @corpus_path = corpus_path
    @template_path = template_path
  end

  def bios
    corpus.map do |attrs|
      Bio.new(*attrs.values_at('name', 'body'))
    end
  end

  def render
    b = binding
    template.result(b)
  end

  def simple_format(text)
    text.lines
      .map(&:chomp)
      .reject(&:empty?)
      .map { |line| "<p>#{line}</p>" }
      .join
  end

  private

  attr_reader :corpus_path, :template_path

  def corpus
    @corpus ||= JSON.parse(File.read(corpus_path))
  end

  def template
    @template ||= ERB.new(File.read(template_path))
  end
end

directory "build"

file 'build/corpus.json' => ['build', *Rake::FileList['bios/*.txt']] do |t|
  corpus = t.sources.grep(/\.txt$/)
    .map do |path|
      {
        name: path.pathmap('%n').gsub('_', ' '),
        body: File.read(path),
      }
    end

  File.open(t.name, 'w') do |f|
    f << JSON.generate(corpus)
  end
end

file 'build/index.html' => ['build/corpus.json', 'templates/index.html.erb'] do |t|
  File.open(t.name, 'w') do |f|
    f << Template.render(*t.sources)
  end
end

task :clean do
  rm_rf 'build'
end
